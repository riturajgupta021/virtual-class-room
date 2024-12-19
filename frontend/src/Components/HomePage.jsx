import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const [input , setInput] = useState("")
    const naviagte = useNavigate()
    const Submitbutton =() =>{
        naviagte(`/room/${input}`)
        alert(input)
    }
  return (
    <div>
      <div>
        <input type="text"
        placeholder='enter your name'
        value={input}
        onChange={(e) =>setInput(e.target.value)} />
        <button onClick={Submitbutton}>Join</button>
      </div>
    </div>
  )
}

export default HomePage
