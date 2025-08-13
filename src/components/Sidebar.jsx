import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import axios from "axios";
import { v1 as uuidv1 } from "uuid";


function Sidebar(){
  const {allThreads, setAllThreads, currThread, setNewChat, setPrompt, setReply, setCurrThread, setPrevChats}= useContext(MyContext);

  const getAllThreads= async ()=>{
    try{
      const response= await axios.get("http://localhost:8080/api/thread");
      const filterData= (response.data).map(thread =>({threadId: thread.threadId, title: thread.title}));
      // console.log(filterData);
      setAllThreads(filterData);

    } catch(error) {
      console.log(error)
    }
  };

  useEffect(()=>{
    getAllThreads();
  },[currThread]);

  const createNewChat= ()=>{
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThread(uuidv1);
    setPrevChats([]);
  }

  const changeThread= async (newThreadId)=>{
    setCurrThread(newThreadId);
    try{
      const response = await axios.get(`http://localhost:8080/api/thread/${newThreadId}`);
      // console.log(response.data);
      setPrevChats(response.data);
      setNewChat(false);
      setReply(null);
    } catch(e) {
      console.log(e);
    }

  }

  const deleteThread= async(threadId)=>{
    try{
      const response = await axios.delete(`http://localhost:8080/api/thread/${threadId}`);
      console.log(response);

      //update threads re-render
      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

      if(threadId === currThread){
        createNewChat();
      }

    } catch(e){
      console.log(e);
    }
  }

    return (
      <section className="sidebar">
        {/* new chat button */}
        <button onClick={createNewChat}>
          <img
            className="logo"
            src="src/assets/OpenAI-black-monoblossom.png"
            alt="Main Logo"
          />
          <span>
            <i className="fa-solid fa-pen-to-square"></i>
          </span>
        </button>
        {/* history */}
        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li key={idx} onClick={(e) => changeThread(thread.threadId)} className= {thread.threadId === currThread ? "highlighted" : " "}>
              {thread.title}
              <i className="fa-solid fa-trash" onClick={(e)=>{
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}></i>
            </li>
          ))}
        </ul>
        {/* Sign */}
        <div className="sign">
          <p>By Anirudh Singh Rathore &hearts;</p>
        </div>
      </section>
    );
};

export default Sidebar;