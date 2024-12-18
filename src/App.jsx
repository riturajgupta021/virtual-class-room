import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './Components/HomePage'
import VideoPage from './Components/VideoPage'

function App() {
  const [count, setCount] = useState(0)
  const router = createBrowserRouter([
    {
      path:"/",
      element: <HomePage/>
    },
    {
      path:"/room/:id",
      element: <VideoPage/>
    }
  ])

  return (
    <>
     <div className='App'>
      <RouterProvider router={router}/>

     </div>

    </>
  )
}

export default App
