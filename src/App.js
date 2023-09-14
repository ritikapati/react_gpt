import { useState,useEffect } from "react";

const App = () => {

  const [value, setValue] = useState('');
  const [message , setMessages] = useState("");
  const[previousChats,setPreviousChats] = useState([])
  const [currentTitle,setCurrentTitle] =  useState(null)

  const createNewChat = () => {
    setMessages(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessages(null)
    setValue("")
  }
  
  const getMessages = async () => {
    const options = {
      method : "POST",
      body : JSON.stringify({
        model: "text-davinci-003",
        message : value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try{
      const response = await fetch('http://localhost:8080/completions',options)
      const data = await response.json()
      setMessages(data.choices[0].message)
    }catch(err){
      const error=err
      console.log(error)
    }
  }

  useEffect( () => {
      console.log(currentTitle,value,message)
      if(!currentTitle && value && message) {
        setCurrentTitle(value)
      } 
      if(currentTitle && value && message) {
        setPreviousChats ( prevChats => (
          [...prevChats, 
            {
               title: currentTitle,
               role:"user",
               content:value
            },
            {
              title : currentTitle,
              role: message.role,
              content: message.content
            }]
        ))
      }
  }, [message, currentTitle, value])

  console.log(previousChats)

  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChats => previousChats.title)))
  console.log(uniqueTitles)


  return (
    <div className="app">
      <section className="side-bar">

        <button onClick={createNewChat}>+ New Chat</button>
        
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle,index) => <li key={index} onClick={() => (handleClick(uniqueTitle))}>{uniqueTitle}</li>)}
        </ul>
        
        <nav>
          <p>Made by Ritika</p>
        
      </nav>
      
      </section>


      <section className="mainbody">
        
        {!currentTitle &&<h1>RitzGPT</h1>}
        <ul className="feed">
              {currentChat.map((chatMessage, index) => <li key = {index}>
                <p className="role">{chatMessage.role}</p>
                <p>{chatMessage.content}</p>
              </li>)}
        </ul>
        
        <div className="bottom-section">
            <div className="input-container">
                  <input value={value} onChange={(e) => setValue(e.target.value)} />
                  <div id="submit" onClick={getMessages}> ➢ </div>
            
          </div>
          
            <p className="info">
              Chat GPT Mar 14 Version. 
              Our goal is to make AI systems more natural and safe to interact with.
              Your feedback will help us improve
            </p>
        
      </div>
      
      </section>
        

       
    </div>
  )
}

export default App;
