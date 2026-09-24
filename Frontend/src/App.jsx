import Todo from "./components/Todo";
import PopUp from "./components/PopUp";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import "./App.css";
function App() {
  const [todo, setTodo] = useState([
  ]);
  const [isVisible, setVisibility] = useState(false);
  const [isEdit, setedit] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [isRender, setRender] = useState(false)
  const [firstRender,setFirst]=useState()
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://localhost:8080/todos')
      const result = await res.json()
      //alert(result.msg)
      const data = result.data
      console.log(data)
      if (data.length > 0) {
        setTodo(data.map((x) => {
          const [year, month, day] = x[2].split("-");
          let r = {
            id: x[0],
            Title: x[1],
            Deadline: `${Number(day)}/${Number(month)}/${year}`
          }
          return r;
        }))
        //setFirst(result.msg)
      }
      else {
        setTodo([])
        setFirst('No data to display')
      }
      
    }
    fetchData()
  }, [isRender])
  useEffect(()=>{
    toast.success(firstRender)
  },[firstRender])
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
        <Todo tod={todo} update={setTodo} open={getDetails} render={setRender}></Todo>
      ) : <p>Please add tasks</p>}
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
