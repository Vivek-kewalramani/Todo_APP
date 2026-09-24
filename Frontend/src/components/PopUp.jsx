import "./PopUp.css";
import { useState } from "react";
function PopUp({onSubmit,oldTodo,onClose }) {
      const [task,setTask]=useState(oldTodo?.Title ?? '' )
      const [deadline,setDeadline]=useState(oldTodo?.Deadline ?? '')
  function formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${Number(day)}/${Number(month)}/${year}`;
  }
  const today = new Date().toISOString().split("T")[0];
  function splitDate(dat)
  {
    if(dat=='')return
    const arr=dat.split('/').reverse()
     arr[1]=arr[1].padStart(2,'0')
     return (arr[0]+'-'+arr[1]+'-'+arr[2])
  }
  return (
    <div className="modal-overlay" onClick={()=>onClose}>
      <div
        id="p1"
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title"> {oldTodo==null?'Add Task':'Edit Task'} </h2>
          <button
            type="button"
            className="modal-close-button"
            aria-label="Close add task dialog"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <input
          type="text"
          placeholder={"Enter task"}
          id="ip"
          value={task}
          onChange={(e) =>{ 
            setTask(e.target.value)
        }}
        ></input>
        <input
          type="date"
          min={today}
          value={splitDate(deadline)}
          disabled={oldTodo==null?false:true}
          id="ip"
          onChange={(e) => setDeadline(formatDate(e.target.value))}
        ></input>
        <button type="button" className="add-task-button" onClick={()=>onSubmit(task,deadline)}>
          Submit
        </button>
      </div>
    </div>
  );
}
export default PopUp;