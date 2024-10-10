import { useCallback, useState, useEffect } from "react";
import { supabase } from './supabaseClient';
import { Table } from "./Table";
import { Nav } from "./Nav";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase.from('cpaex').select('*');

    if (error) {
      console.log('error', error);
    } else {
      setData(data);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app">
      <Nav leeds={data} fetchData={fetchData} />
      <Table data={data} />
    </div>
  );
}

export default App;
