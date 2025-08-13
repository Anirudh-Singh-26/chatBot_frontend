import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ScaleLoader } from "react-spinners";

function ChatWindow(){
  const {reply, setReply, prompt, setPrompt, currThread, setPrevChats, setNewChat }= useContext(MyContext);
  const [loading, setLoading]= useState(false);
  const [isOpen, setIsOpen]= useState(false);

  const getReply= async ()=>{
    setLoading(true);
    setNewChat(false);

    console.log("message ", prompt, " threadId ", currThread, "reply", reply);
    if (!prompt.trim()) return;
    const data= {
      threadId: currThread,
      messages: prompt, 
    }
    try {
      const res= await axios.post("http://localhost:8080/api/chat", data );
      console.log(res.data.reply.response);
      setReply(res.data.reply.response);

    } catch(e){
      console.log(e);
    }
    setLoading(false);
  }

  //Apppend new chat to prevChats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  const handleProfileClick= ()=>{
    setIsOpen(!isOpen);
  }

    return (
      <div className="chatWindow">
        <div className="navbar">
          <span>
            GPT <i className="fa-solid fa-angle-down"></i>
          </span>
          <div className="userIconDiv" onClick={handleProfileClick}>
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        </div>
        {isOpen && (
          <div className="dropDown">
            <div className="dropDownItem">
              <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
            </div>
            <div className="dropDownItem">
              <i className="fa-solid fa-gear"></i> Settings
            </div>
            <div className="dropDownItem">
              <i className="fa-solid fa-right-from-bracket"></i> Log out
            </div>
          </div>
        )}
        <Chat />
        {loading && (
          <div style={{ textAlign: "center", height: "5rem", width: "5rem" }}>
            <ScaleLoader color="#fff" loading={loading} />
            <p className="loaderText">Thinking</p>
          </div>
        )}

        <div className="chatInput">
          <div className="inputBox">
            <input
              placeholder="Ask anything"
              className="input"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
            />

            <div id="submit" onClick={getReply}>
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>
          <p className="info">
            GPT can make mistakes. Check important info. See Cookie Preferences.
          </p>
        </div>
      </div>
    );
}

export default ChatWindow;