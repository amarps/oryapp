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
    const [columnStr,setColumn]=useState('');
    const [whereStr,setWheres]=useState('');
    const [td,setTd]=useState([{}]);
    const submit = async (e:SyntheticEvent) => {
        e.preventDefault();
        var columns = columnStr.replaceAll(/\s/g,'').split(',');
        
        var wheres = whereStr.split(';');
        let where: { identifier: string, sign: string, value: string}[] = [];
        if (wheres.length != 0) {
            wheres.forEach(w => {
                var wArr = w.split(',');
                if (wArr.length != 1)
                {
                    where.push({
                        "identifier": wArr[0],
                        "sign": wArr[1],
                        "value": wArr[2]
                    })
                }
            });
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "table": "user",
            "columns": columns,
            "where": where,
          });

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
                <div className="flex-item blue">FROM</div>
                <div className="flex-item">user</div>
                <div className="flex-item flex-fill"></div>
            </div>
        
        
            <div className="d-flex">
                <div className="flex-item blue">SELECT</div>
                <div className="flex-item flex-fill">
                    <input onChange={e =>setColumn(e.target.value)} className="w-100" placeholder="username, email"></input>
                </div>
            </div>
        
        
            <div className="d-flex">
                <div className="flex-item blue">WHERE</div>
                <div className="flex-item flex-fill">
                <input onChange={e =>setWheres(e.target.value)} className="w-100" placeholder="col,=,2; col,<,3"></input>
                </div>
            </div>
        </div>

        <DynamicTable data={td} />
	</Layout>
  )
};
export default Query;