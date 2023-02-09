import { useEffect } from "react";

  const DynamicTable: React.FC<any> = ({ data }) => {


    if(data.length == 0) {
        return (<div>no data</div>)
    }
// get table column
 const column = Object.keys(data[0]);
 // get table heading data
 const ThData =()=>{
     return column.map((dt)=>{
         return <th key={dt}>{dt}</th>
     })
 }
// get table row dt
const tdData =() =>{
   
     return data.map((dt)=>{
       return(
           <tr>
                {
                   column.map((v)=>{
                       return <td>{dt[v]}</td>
                   })
                }
           </tr>
       )
     })
}
  return (
      <table className="table">
        <thead>
         <tr>{ThData()}</tr>
        </thead>
        <tbody>
        {tdData()}
        </tbody>
       </table>
  )
}
export default DynamicTable;