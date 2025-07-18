import { useState, useEffect, useRef } from 'react'
import './App.css'


function App() {
  const [ur, setUr] = useState('');
  const [pass, setPass] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showT, setShowT] = useState(false);
  const [showS, setShowS] = useState(true);
  const [list, setList] = useState('');
  const [tl, setTl] = useState([])
  const [isOverlined, setIsOverlined] = useState([]);

  let data = {
    ur,
    pass
  }

  let result;

  async function hs() {
    if (ur == '') {
      alert("filling user name is required.")
    } if (pass == '') {
      alert("filling passwerd is required.")
    } else {
      try {
        const response = await fetch('https://todo-backend-3-9tr9.onrender.com/singup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        result = await response.json();

        if (result == "someone") {
          alert("This passward is invalide.")
          setUr('')
          setPass('')
        } else {
          if (!result) {
            alert('Wrong credential retry')
          } else {
            setShowLogin(true);
            setShowS(false)
            setUr("");
            setPass("")
          }
        }

      } catch (error) {
        console.error('Error sending data:', error);
      }

    }
  }

  async function hl() {

    if (ur == '') {
      alert("filling user name is required.")
    } if (pass == '') {
      alert("filling passwerd is required.")
    } else {
      try {
        const response = await fetch('https://todo-backend-3-9tr9.onrender.com/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        result = await response.json();
        if (result) {
          getlist();
        }
      } catch (error) {
        console.error('Error sending data:', error);
      }
      if (!result || result == "no") {
        alert('Wrong credential retry')
      } else {
        setShowLogin(false);
        setShowT(true)
        setUr("");
        setPass("")
      }
    }
  }

  //handle not have account

  function hnha() {
    setShowS(true);
    setShowLogin(false);
    setShowT(false)
  }

  function hha() {
    setShowS(false);
    setShowLogin(true);
    setShowT(false)
  }
  //handle todo
  async function getlist() {
    try {
      const response = await fetch('https://todo-backend-3-9tr9.onrender.com/getTodos', {
        method: "GET",
        credentials: "include", // ⬅️ Required to send cookie
      });

      result = await response.json();
      if (result == "no") {
        alert("Unown User.")
      } else {
        setTl(result);
      }


    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   getlist();
  // }, [])

  async function htl() {
    try {
      const response = await fetch('https://todo-backend-3-9tr9.onrender.com/todo', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: list,
      });

      result = await response.json();


      getlist();
      setList('');
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }

  //handle delete 
  async function hd(index) {
    try {
      const dl = index;
      const response = await fetch('https://todo-backend-3-9tr9.onrender.com/delete', {
        method: "POST",
        credentials: "include",
        body: dl, // ⬅️ Required to send cookie
      });

      result = await response.json();
      getlist();
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }

  //handle update

  async function hu(value) {
    try {
      setList(value);
      hd(value);
    } catch (error) {
      console.log(error)
    }
  }

  function refresh() {
    getlist();
  }

  // Handle isDone toggle
async function hup(todoItem) {
  try {
    const response = await fetch('https://todo-backend-3-9tr9.onrender.com/hup', {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json', // ⬅️ Required for JSON
      },
      body: JSON.stringify({
        _id: todoItem._id,
        isDone: todoItem.isDone
      })
    });

    result = await response.json();
    getlist(); // Refresh todo list
  } catch (error) {
    console.error('Error toggling isDone:', error);
  }
}





  return (
    <>
      {showS ? (
        <div className="log"><h1>SingUp</h1>  <div className="login">
          <h2>User Name:</h2>
          <input type="text" onChange={(e) => setUr(e.target.value)} required value={ur} className="ur" />
          <h2>Passward: </h2>
          <input type="text" className="ur ps" value={pass} required onChange={(e) => setPass(e.target.value)} /><br></br>
          <button type='submit' className='submit' onClick={hs} name='submit'>Submit</button>
        </div>
          <h3 className='h3' onClick={hha}>Login.</h3>
        </div>) : null}
      {/* login*/}
      {showLogin ? (
        <div className='b'>
          <div className="log"><h1>LogIn</h1>  <div className="login">
            <h2>User Name:</h2>
            <input type="text" onChange={(e) => setUr(e.target.value)} required className="ur" />
            <h2>Passward: </h2>
            <input type="text" className="ur ps" required onChange={(e) => setPass(e.target.value)} /><br></br>
            <button type='submit' className='submit' onClick={hl} name='submit'>Submit</button>
          </div>
            <h3 className='h3' onClick={hnha}>I don't have any account.</h3>
          </div>
        </div>
      ) : null}
      {/* function of todo */}
      {showT ? (
        <div className="container">
          <div className="hed">

            <div className='hb'> <h1 className="hedder">Tode List</h1> <button className='rbtn' onClick={getlist}>🔄</button>  </div>
            <input type="text" value={list} onChange={(e) => setList(e.target.value)} placeholder='Add Todo Here' className="text" />
            <div onClick={htl} className="add">Add
            </div></div>
          <div className='list'>
            <div className="list1">
              <h2 className="yl">Your Todos</h2>
              <ol className='ol'>
                {tl.map((value, index) => (
                  <li style={{textDecoration: value.isDone ? "line-through" : "none"}} onClick={()=> hup(value)} className='li' key={index}>{value.todo}
                    <div><button onClick={() => hu(value.todo)} className='update btn'>Update</button><button onClick={() => hd(value.todo)} className='delet btn'>Delete</button></div></li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default App
