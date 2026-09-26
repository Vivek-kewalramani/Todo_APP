import Todo from "./components/Todo";
import PopUp from "./components/PopUp";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { FaFilterCircleXmark } from "react-icons/fa6";
import "./App.css";
function App() {
  const [todo, setTodo] = useState([
  ]);
  const [filteredData,setFilteredData]=useState([]);
  const [isVisible, setVisibility] = useState(false);
  const [isEdit, setedit] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [isRender, setRender] = useState(false)
  const [firstRender, setFirst] = useState()
  const today = new Date().toISOString().split("T")[0];
  const [fromPicker, setFromPicker] = useState('')
  const [toPicker, setToPicker] = useState('')
  const [isFilterApplied,setApplied]=useState(false)
  function formatString(str) {
    return str.split('-').reverse()
  }
  function Split(s) {
    return s.split('/')
  }
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://localhost:8080/todos')
      const result = await res.json()
      //alert(result.msg)
      const data = result.data
      console.log(data)
      if (data.length > 0) {
        const mappedData = data.map((x) => {
          const [year, month, day] = new Date(x[2]).toISOString().split("T")[0].split("-");
          let r = {
            id: x[0],
            Title: x[1],
            Deadline: `${Number(day)}/${Number(month)}/${year}`
          }
          return r;
        })
        setTodo(mappedData)
        setFilteredData(mappedData);
        
        //setFirst(result.msg)
      }
      else {
        setTodo([])
        setFilteredData([])
        setFirst('No data to display')
      }

    }
    fetchData()
  }, [isRender])
  useEffect(() => {
    toast.success(firstRender)
  }, [firstRender])
  async function saveTodo(task, deadline) {
    let final;
    if (!isEdit) {
      if (!task || !deadline) {
        toast.warn('Please add valid input')
        return;
      }
      //console.log(todo)
      const res = await fetch('http://localhost:8080/post', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          user_task: task,
          user_deadline: deadline
        })
      })
      final = await res.json()

    }
    else {
      //  console.log(task)
      const resp = await fetch('http://localhost:8080/edit',
        {
          method: "PATCH",
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            user_task: task,
            user_id: editTodo.id
          })
        }
      )
      final = await resp.json()
      //alert(final.msg)
      // setTodo((t)=>
      //   t.map((x)=>{
      //     if(x.id==editTodo.id)
      //     {
      //       x.Title=task
      //     }
      //     return x
      //   })
      // )

      setEditTodo(null)
    }
    toast.success(final.msg)
    setVisibility(false);
    setRender(r => !r)
  }
  function openPopup() {
    setVisibility(true);
    setedit(false);
  }
  function getDetails(editingTodo) {
    setVisibility(true);
    setedit(true);
    setEditTodo(editingTodo);
  }
  return (
    <>
      <div className="heading-title">
        <h1>Todo App</h1>
      </div>
      <div id="d">
        <div id="d2">
          <h2>Tasks:</h2>
        </div>
        <div id="d1">
          <button className="add-task-button" onClick={openPopup}>
            Add Task
          </button>
        </div>
      </div>
      {todo.length > 0 ? (
        <div className="filter">
          <h3>From</h3>
          <input type="date" className="picker" min={today} value={fromPicker} onChange={
            (e) => {
              setFromPicker((e.target.value))
            }}></input>
          <h3>To</h3>
          <input type="date" className="picker" min={today} value={toPicker} onChange={
            (e) => {
              setToPicker((e.target.value))
            }}>
          </input>
          <button className="filter-task-button" onClick={() => {
    
            const [dateF, monthF, yearF] = formatString(fromPicker)
            //console.log(Number(dateF),Number(monthF),Number(yearF))
            const [dateT, monthT, yearT] = formatString(toPicker)
            // console.log(Number(dateT),Number(monthT),Number(yearT))
            if (Number(monthF) > Number(monthT)) {
              toast.warn('Please enter valid date filter')
              return
            } else if ((Number(monthF) == Number(monthT)) && (Number(dateF) > Number(dateT))) {
              toast.warn('Please enter valid date filter')
              return
            }
            else {
              setFilteredData(todo.filter((t) => {
                const [dd, mm, yy] = Split(t.Deadline)
                return (Number(mm) >= Number(monthF) && Number(mm) <= Number(monthT) ? (Number(mm) == Number(monthF) && Number(mm) == Number(monthT)) ? ((Number(dd) >= Number(dateF) && Number(dd) <= Number(dateT)) ? true : false) : ((Number(dd) >= Number(dateF)) || (Number(dd) <= Number(dateT)) ? true : false) : false)
              }
              ))
            }
            setApplied(true)
          }}
            disabled={((fromPicker == '') || (toPicker == '')) ? true : false}>Apply Filter</button>
          <button className="remove-filter-button" disabled={isFilterApplied ? false : true}
            onClick={() => {
              setFromPicker('')
              setToPicker('')
              // setRender(r => !r)
              setApplied(false)
            }}>
            <FaFilterCircleXmark size={20} />
          </button>
        </div>
      ) : null}
      {(todo.length > 0) && (!isFilterApplied) ? (
        <Todo tod={todo} open={getDetails} render={setRender}></Todo>
      ) :(isFilterApplied && filteredData.length>0)  ? <Todo tod={filteredData}  open={getDetails} render={setRender}></Todo> : <p>Please add tasks</p>}
      {isVisible ? (
        <PopUp
          onSubmit={saveTodo}
          oldTodo={editTodo}
          onClose={() => {
            setVisibility(false);
            setEditTodo(null);
          }}
        />
      ) : null}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        theme="dark"
        pauseOnHover
      />
    </>
  );
}

export default App;
