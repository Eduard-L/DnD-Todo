import "./App.css";
import { Container } from "./Container.js";
import { useEffect, useState } from "react";
import { DndItem } from "./DndItem";
import { startContainers } from "./Data.js";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Routes, Route, Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { Register } from "./Register";
import { Api } from "./utils/myApi";
import { useNavigate } from "react-router-dom";
import { deleteCookie, getCookie, setCookie } from "./utils/handleCookies";
import Cookies from "js-cookie";
import { ProtectedComponent } from "./ProtectedComponent";
import { Main } from "./Main";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "./redux/slice";


export default function App() {
  const [containers, setContainers] = useState([]);
  const [task, setTask] = useState("");
  const [disableDrag, setDisableDrag] = useState(true);
  const navigate = useNavigate()
  const [token, setToken] = useState(getCookie('token').token || '')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [options, setOptions] = useState();
  const [selectId, setSelectId] = useState(null)
  const [conTitle, setConTitle] = useState("");
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.userInfo)


  useEffect(() => {
    if (token) {
      Api.getUserInfo(token).then((userInfo) => {

        if (userInfo) {
          setUserInfo(userInfo)
          dispatch(setUserInfo(userInfo))
          setIsLoggedIn(true)
          setContainers(userInfo.containers)
          navigate('/containers')
          let options = []
          userInfo.containers.forEach((c) => {
            options.push(c.title)
          })
          setOptions(options)
        }
        else {

          setIsLoggedIn(false)
          setUserInfo({})
          setContainers([])
          navigate('/')

        }
      }).catch((e) => {
        alert(e)
      })
    }

  }, [token])

  const handleUpdateUserInfo = () => {

    Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, containers).then((userInfo) => {
      console.log('success')
    }).catch((e) => alert(e))
  }




  const handleChangeSelect = (newValue) => {

    setSelectId(() => {
      if (newValue === options[0]) {
        return 1
      }
      else {
        return 2
      }
    })
  }

  const handleAddContainer = (e) => {
    e.preventDefault();
    const seq = containers.length;
    Api.createNewContainer(conTitle, token, seq).then((container) => {
      if (container) {
        const newContainers = [...containers, container]
        Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, newContainers).then((userInfo) => {
          if (userInfo) {
            setContainers(userInfo.containers);
          }
        })

      }
    }).catch((e) => alert(e))

    setConTitle("");
  };

  const handleAddTask = (e, id) => {
    e.preventDefault();
    if (!id) return

    // const c = containers.find((c) => c.id === id);
    // c.tasks.push({ id: uuidv4(), text: task, conId: id });
    // let newCon = [...containers];
    // newCon = newCon.filter((c) => c.id !== id);
    // // console.log(c);
    // newCon.push(c);
    // newCon.sort((a, b) => a.id - b.id);
    // // console.log(newCon);
    // setContainers(newCon);
    // setTask("");
  };

  const handleDragItem = (dragIndex, hoverIndex) => {
    const newCont = [...containers];
    const dragItem = containers[dragIndex];
    if (!dragItem) return
    console.log(dragItem)

    newCont.splice(dragIndex, 1);
    newCont.splice(hoverIndex, 0, dragItem);

    setContainers(newCont);
  };
  const handleRegistration = (e, formValues) => {

    e.preventDefault()
    Api.createNewUser(formValues).then((res) => {
      if (res) {
        navigate('/')
      }
      else {
        console.log('fuck u')
      }
    }).catch((e) => {
      console.log(e)
    })
  }

  const handleLogOut = () => {
    deleteCookie('token')
    setIsLoggedIn(false)
    navigate('/')
    setToken('')
    setUserInfo({})
    setContainers([])
  }

  const handleLogIn = (e, formValues) => {
    console.log(formValues)
    e.preventDefault()
    Api.handleLog(formValues).then((token) => {
      if (token) {
        // setCookie('token', 'bar')

        setCookie('token', token)
        setToken(token)
        setIsLoggedIn(true)
        navigate('/containers')
      }
      else {
        console.log('fuck u')
        setIsLoggedIn(false)
        navigate('/')
        setToken('')
      }
    })
  }

  const handleDeleteContainer = (id) => {
    Api.handleDeleteCon(token, id)
      .then((res) => {
        if (res) {
          const newCons = containers.filter((c) => c._id !== id);
          setContainers(newCons);
          Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, newCons)

        }
      }).then(() => {



      }).catch((e) => console.log(e))

  };



  return (
    <div className="App justify-center h-screen w-screen">
      <Routes>
        <Route path="/signup" element={<Register handleSubmit={handleRegistration} text='SignUp' btnText='Create' isRegisterFormOpen={true} />} />
        <Route path="/" element={<Register handleSubmit={handleLogIn} text='SignIn' btnText='Log In' isRegisterFormOpen={false} />} />
        <Route path="/containers" element={<ProtectedComponent
          Component={Main}
          isLoggedIn={isLoggedIn}
          handleAddContainer={handleAddContainer}
          selectId={selectId}
          conTitle={conTitle}
          setConTitle={setConTitle}
          handleAddTask={handleAddTask}
          handleChangeSelect={handleChangeSelect}
          options={options}
          userInfo={userInfo}
          task={task}
          setTask={setTask}
          containers={containers}
          handleDragItem={handleDragItem}
          disableDrag={disableDrag}
          setDisableDrag={setDisableDrag}
          setContainers={setContainers}
          token={token}
          onLogOut={handleLogOut}
          onSave={handleUpdateUserInfo}
          onDeleteCon={handleDeleteContainer}
        />} />
      </Routes>

    </div>
  );
}
