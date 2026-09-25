import makeConnection from "./dbConnect.js";
import express from "express";
const app = express();
import cors from "cors";
app.use(
  cors({
    origin: process.env.ORIGIN,
  }),
);
 app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/todos", async (req, res) => {
  try {
  const connect=await makeConnection();
  const result=await connect.execute(
        "SELECT id,Title, Deadline as Deadline FROM Todos order by created_at;"
    );
  await connect.close()
  res.status(200).json(
    {
      msg:'data fetched successfully',
      data:result.rows
    }
  )
  } catch (error) {
    res.status(404).json(
      {
        msg:'Error in fetching data'
      }
    )
  }
  console.log(req.method);
  
});

app.post('/post',async (req,res)=>{
  // console.log(req.body.id)
  const binds={
    Id:crypto.randomUUID(),
    title:req.body.user_task,
    expiry:req.body.user_deadline
  }
  try {
    const connect=await makeConnection()
  const result=await connect.execute(
    `INSERT INTO Todos(id,Title,Deadline) Values(:Id,:title,
    SYS_EXTRACT_UTC(
    FROM_TZ(
      TO_TIMESTAMP(:expiry || ' 23:59:59', 'DD/MM/YYYY HH24:MI:SS'), 
      'Asia/Kolkata'
    )
  )
    )`,binds,{
      autoCommit:true
    }
  )
  console.log(result)
  await connect.close()
  res.status(200).json(
    {
    msg:'Task added successfully'
    }
  )
    
  } catch (error) {
    res.status(404).json(
      {
        err:`Error in adding data - ${error}`
      }
    )
  }
  
})

app.delete('/delete',async (req,res)=>{
  const binds={
    User_id:req.body.user_id
  }
  try {
    const connect= await makeConnection()
    const result=await connect.execute(
  "DELETE FROM Todos WHERE id=:User_id",binds,{
    autoCommit:true
  }
  )
  res.status(200).json({
    msg:'Deleted successfully'
  })
  } catch (error) {
    res.status(404).json(
      {
        err:`Error in deleting data - ${error}`
      }
    )
  }
  
  
})

app.patch('/edit',async (req,res)=>{
  const binds={
    user_title:req.body.user_task,
    user_id:req.body.user_id
  }
  try {
    const connect=await makeConnection();
  const result=await connect.execute(
    "UPDATE Todos SET title = :user_title WHERE id=:user_id",
    binds,
    {
      autoCommit:true
    }
    
  )
  res.status(200).json({
    msg:'Edited successfully'
  })
  } catch (error) {
    res.status(404).json(
      {
        err:`Error in deleting data - ${error}`
      }
    )
  }
  console.log('updated-',result)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
