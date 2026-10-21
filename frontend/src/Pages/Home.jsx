import { Link } from "react-router-dom"

function Home() {
  return (
    <>
      
      <h1>Home Page</h1>
        <Link to="/">Home</Link><br />
        <Link to="/register"><button>Go to Register</button></Link>
        
       
      
    
    </>
   
  )
}

export default Home
