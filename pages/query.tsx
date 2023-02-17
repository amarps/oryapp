import Layout from "../layouts/Layout"
import Head from "next/head"
import { QueryBuilder } from 'react-querybuilder';
import { useEffect, useState, SyntheticEvent } from "react"
import 'react-querybuilder/dist/query-builder.scss';
import DynamicTable from "../components/dynamic_table";

interface WhereInterface {
    identifier: string;
    sign: string;
    value: string;
}

const Query = () => {
    const [columns,setColumn]=useState([]);
    const [wheres,setWheres]=useState([]);
    const [availableCol, setAvailableCol]=useState([]);
    const [availableOperator, setAvailableOperator]=useState([
        "=",
        "!=",
        "<",
        "<=",
        ">",
        ">=",
        "IN",
        "NOT IN",
    ]);
    const [td,setTd]=useState([{}]);

    useEffect(() => {
        var myHeaders = new Headers();
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };
        // Update the document title using the browser API
        fetch("http://localhost:8000/columns", requestOptions)
            .then(response => response.json())
            .then(result => { 
                console.log(result)
                setAvailableCol(result);              
            })
            .catch(error => console.log('error', error));
      }, availableCol);

    const submit = async (e:SyntheticEvent) => {
        e.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "table": "user",
            "columns": columns,
            "where": wheres,
          });

          console.log(columns)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

        await fetch("http://localhost:8000/query", requestOptions)
            .then(response => response.json())
            .then(result => { 
                console.log(result);
                setTd(result);
            })
            .catch(error => console.log('error', error));
    }

    const addInput = () => {   
        setColumn(s => {
            return[
                ...s,"id"
            ]
        })
    }

    const handleChange = e => {
        e.preventDefault();
    
        const index = e.target.id;
        setColumn(s => {
          const newArr = s.slice();
          newArr[index] = e.target.value;
        
          return newArr;
        });
      };

    
      const addInputWhere = () => {   
        setWheres(s => {
            return[
                ...s,{
                    "identifier": "id",
                    "sign": "=",
                    "value": ""
                }
            ]
        })
    }

    const handleChangeWheres = e => {
        e.preventDefault();
    
        const index = e.target.id;
        setWheres(s => {
          const newArr = s.slice();
          newArr[index].identifier = e.target.value;
    
          return newArr;
        });
      };

      const handleChangeWheres2 = e => {
        e.preventDefault();
    
        const index = e.target.id;
        setWheres(s => {
          const newArr = s.slice();
          newArr[index].sign = e.target.value;
    
          return newArr;
        });
      };

      const handleChangeWheres3 = e => {
        e.preventDefault();
    
        const index = e.target.id;
        setWheres(s => {
          const newArr = s.slice();
          newArr[index].value = e.target.value;
    
          return newArr;
        });
      };

  	return (
	<Layout>
		<Head>
        	<title>Create account - Ory NextJS Integration Example</title>
        	<meta name="description" content="NextJS + React + Vercel + Ory" />
      	</Head>
		  
        <div className="container">
            <h1 className="h3 mb-3 fw-normal">Query</h1>
            <button className="btn btn-sm btn-primary" onClick={submit} type="submit">Submit</button>
        </div>
        <div className="query">
            <div className="d-flex">
                <div className="bg-white flex-item blue">FROM</div>
                <div className="bg-white flex-item">user</div>
                <div className="bg-white flex-item flex-fill"></div>
            </div>
        
        
            <div className="d-flex">
                <div className="bg-white flex-item blue">SELECT</div>
                    {columns.map((item, i) => {
                        return (
                        <div className="bg-white flex-item qform">
                            <select id={i} onChange={handleChange} className="w-100">
                                {availableCol.map((jtem, j) => {

                                    return(<option key={j} name={jtem}>{jtem}</option>)
                                })}
                            </select>
                            {/* <input id={i} onChange={handleChange} className="w-100" placeholder="username"></input> */}
                        </div>
                        );
                    })}
                
                <button className="btn btn-primary flex-item" onClick={addInput} type="submit">+</button>
                <div className="bg-white flex-item flex-fill"></div>
            </div>
        
        
            <div className="d-flex">
                <div className="bg-white flex-item blue">WHERE</div>
                {wheres.map((item, i) => {
                    return (
                        <div className="bg-white flex-item qform">
                            <select id={i} onChange={handleChangeWheres} className="w-100">
                                {availableCol.map((jtem, j) => {
                                    return(<option key={j} name={jtem}>{jtem}</option>)
                                })}
                            </select>
                            <select id={i} onChange={handleChangeWheres2} className="w-100">
                                {availableOperator.map((jtem, j) => {
                                    return(<option key={j} name={jtem}>{jtem}</option>)
                                })}
                            </select>
                            {/* <input id={i} onChange={handleChangeWheres2} className="whereform" placeholder="="></input> */}
                            <input id={i} onChange={handleChangeWheres3} className="whereform" placeholder="val"></input>
                        </div>
                    );
                })}
                <button className="btn btn-primary flex-item" onClick={addInputWhere} type="submit">+</button>
                <div className="bg-white flex-item flex-fill"></div>
            </div>
        </div>

        <DynamicTable data={td} />
	</Layout>
  )
};
export default Query;