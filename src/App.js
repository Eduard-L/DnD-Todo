import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Register } from "./Register";
import { Api } from "./utils/myApi";
import { useNavigate } from "react-router-dom";
import { deleteCookie, getCookie, setCookie } from "./utils/handleCookies";
import { ProtectedComponent } from "./ProtectedComponent";
import { Main } from "./Main/Main";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "./redux/userInfoSlice";
import { PopupWithMessage } from "./PopupWithMessage";
import { setPopupMessage } from "./redux/popupMessageSlice";
import { DARK, darkModeBackGround, serverMessages, ligthModeBackGround, LIGHT } from "./utils/constants";


// import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { setVisibilityMode } from "./redux/visibilityModeSlice";
// import { PreLoader } from "./PreLoader/PreLoader";
import { setIsLoading } from "./redux/isLoadingSlice";
import { MaterialUISwitch } from "./utils/materialCustomStyles";
// import { PopupWithQuestion } from "./PopupWithQuestion/PopupWithQuestion";







export default function App() {
  const [containers, setContainers] = useState([]);
  const [boards, setBoards] = useState([])
  const [task, setTask] = useState("");
  const [disableDrag, setDisableDrag] = useState(true);
  const navigate = useNavigate()
  const [token, setToken] = useState(getCookie('token').token || '')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [conTitle, setConTitle] = useState("");
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.userInfo)
  const messageState = useSelector((state) => state.message)
  const visibilityMode = useSelector((state) => state.mode)


  const background = (visibilityMode === DARK) ? darkModeBackGround : ligthModeBackGround


  const handleServerMessages = useCallback((status) => {

    if (!status) return
    console.log(status)
    switch (status) {
      case '401':
        dispatch(setPopupMessage(serverMessages.unauthorized))
        break;

      case '500':
        dispatch(setPopupMessage(serverMessages.serverError));
        break;

      case '200':
        dispatch(setPopupMessage(serverMessages.success));
        break;

      case '404':
        dispatch(setPopupMessage(serverMessages.notFound));
        break;

      case '403':
        dispatch(setPopupMessage(serverMessages.forbiden));
        break;

      case '409':
        dispatch(setPopupMessage(serverMessages.conflictError));
        break;

      case '400':
        dispatch(setPopupMessage(serverMessages.BadRequest));
        break;

      case 'Failed to fetch':
        dispatch(setPopupMessage(serverMessages.serverNotConnected))
        break;

      case 'confirm error':
        dispatch(setPopupMessage({ message: "The password and confirmation do not match", severity: "error", isOpen: true }))
        break;
    }

  }, [])

  useEffect(() => {
    if (token) {
      Api.getUserInfo(token).then((user) => {
        if (user) {
          dispatch(setUserInfo(user))
          setBoards(user.boards)
          setIsLoggedIn(true)
          navigate('/boards')
        } else {
          setIsLoggedIn(false)
          navigate('/')
        }
      }).catch((e) => {
        handleLogOut()
        handleServerMessages(e.message)
      })

    }

  }, [token])

  const handleUpdateUserInfo = () => {

    console.log('1')
    Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, boards).then((userInfo) => {
      if (userInfo) {
        handleServerMessages('200')
      }
    }).catch((e) => handleServerMessages(e.message))
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
            handleServerMessages('200')

          }
        })

      }
    }).catch((e) => handleServerMessages(e.message))

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

  const handleDragItems = (dragIndex, hoverIndex, items, setItems) => {
    const newItems = [...items];
    const dragItem = items[dragIndex];
    if (!dragItem) return


    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);

    setItems(newItems)
  };


  const handleRegistration = (e, formValues) => {
    e.preventDefault()
    const { password, confirm } = formValues
    if (password !== confirm) {
      handleServerMessages('confirm error')
      return
    }

    Api.createNewUser(formValues).then((res) => {
      if (res) {
        navigate('/')
        handleServerMessages('200')

      }

    }).catch((e) => {
      handleServerMessages(e.message)
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
    dispatch(setIsLoading(true))
    e.preventDefault()
    Api.handleLog(formValues).then((token) => {
      if (token) {
        setCookie('token', token)
        setToken(token)
        setIsLoggedIn(true)
        navigate('/boards')
      }

    }).catch(e => {
      handleServerMessages(e.message);
      handleLogOut()
    }).finally(() => {
      dispatch(setIsLoading(false))
    })
  }

  const handleDeleteContainer = (id) => {

    Api.handleDeleteCon(token, id)
      .then((res) => {
        if (res) {
          const newCons = containers.filter((c) => c._id !== id);
          setContainers(newCons);
          Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, newCons)
          handleServerMessages('200')



        }
      }).catch((e) => handleServerMessages(e.message))

  };

  const handleChangeMode = () => {
    if (visibilityMode === DARK) {
      dispatch(setVisibilityMode(LIGHT))
    } else {
      dispatch(setVisibilityMode(DARK))
    }

  }

  const handleAddNewBoard = (title) => {

    Api.handleAddNewBoard(token, title)
      .then((board) => {
        const newBoards = [...boards, board]
        Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, newBoards).then((userInfo) => {
          if (userInfo) {
            setBoards(userInfo.boards)
            dispatch(setUserInfo(userInfo))
          }
        }).catch((e) => handleServerMessages(e.message))

      }).catch((e) => handleServerMessages(e.message))
  }
  const handleDeleteBoard = (id, closePopup) => {
    const newBoards = [...boards].filter((b) => b._id !== id)
    Promise.all([Api.handleDeleteBoard(token, id), Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, newBoards)]).then((data) => {
      const userInfo = data[1];
      if (userInfo) {
        setBoards(userInfo.boards)
        dispatch(setUserInfo(userInfo))
        closePopup()
      }
    }).catch((e) => handleServerMessages(e.message))

  }

  const handleUpdateBoardInfo = (e, id, title, containers, closePopup) => {

    console.log(id)
    e.preventDefault()
    const newBoards = [...boards].map((b) => {
      if (b._id === id) {
        return { ...b, title: title, containers: containers }
      }
      return b
    })
    Promise.all([Api.handleUpdateBoard(token, id, title, containers), Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, newBoards)]).then((data) => {
      if (data) {
        setBoards(data[1].boards)
        dispatch(setUserInfo(data[1]))
        closePopup()
      }
    }).catch((e) => handleServerMessages(e.message))
  }



  return (
    <div className="App justify-center h-screen w-screen" style={{ background: background }}>

      <FormControlLabel
        className="absolute top-2 right-1"
        control={<MaterialUISwitch checked={visibilityMode === DARK} onChange={handleChangeMode} />}

      />
      <Routes>
        <Route path="/signup" element={<Register handleSubmit={handleRegistration} path='/' text='SignUp' btnText='Create' isRegisterFormOpen={true} subtitleText='Click Here To Log In' />} />
        <Route path="/" element={<Register handleSubmit={handleLogIn} text='Login' path='/signup' btnText='Log In' subtitleText='Click Here To Sign Up' isRegisterFormOpen={false} />} />
        <Route path="/boards" element={<ProtectedComponent
          Component={Main}
          isLoggedIn={isLoggedIn}
          handleAddContainer={handleAddContainer}
          conTitle={conTitle}
          setConTitle={setConTitle}
          handleAddTask={handleAddTask}
          handleServerMessages={handleServerMessages}
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
          setBoards={setBoards}
          boards={boards}
          onAddBoard={handleAddNewBoard}
          handleDragItems={handleDragItems}
          onDelete={handleDeleteBoard}
          onUpdate={handleUpdateBoardInfo}

        />} />

      </Routes>



      <PopupWithMessage isOpen={messageState.isOpen} message={messageState.message} severity={messageState.severity} />
    </div>
  );
}
