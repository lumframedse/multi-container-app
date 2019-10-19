import React,{useState,useEffect} from 'react';
import axios from 'axios';

export default () =>{

    const [values,setValues] = useState([]);
    const [indices, setIndices ] = useState([]);
    const [index,setIndex] = useState('');
    
    useEffect(()=>{

        const getValues = async ()=> {
            const result = await axios.get('/api/values/current')
            setValues(result.data);
        }

        const getIndices = async () => {
            const result = await axios.get('/api/values/all');
            setIndices(result.data);
        }
        getValues();
        getIndices();

    },[])

    const submitForm = async (event) =>{
        event.preventDefault();
        await axios.post('/api/values',{index});
        setIndex('');
    }

    const renderValues = () => {
        const entries = [];
        for(let hashKey in values){
            entries.push(<div key={hashKey}>
                For index {hashKey} I calculated {values[hashKey]}
            </div>)
        }
        return entries;
    }
    
        
    return(
        <div>
            <form onSubmit={submitForm} >
                <label> Enter your index </label>
                <input type="text" name="index" value={index} onChange={(e)=>{setIndex(e.target.value)}}/>
                <button type="submit" >Submit</button>
            </form>

            <h3> Indices that I have seen:</h3>
            <p>{indices.join(', ')}</p>

            <h3>Calculated values:</h3>
                {renderValues()}
        </div>
    )
}