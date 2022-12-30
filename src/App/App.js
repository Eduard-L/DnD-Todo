import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Register } from "../Register/Register";
import { Api } from "../utils/myApi";
import { useNavigate } from "react-router-dom";
import { deleteCookie, getCookie, setCookie } from "../utils/handleCookies";
import { ProtectedComponent } from "../ProtectedComponent";
import { Boards } from "../Boards/Boards";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../redux/userInfoSlice";
import { PopupWithMessage } from "../PopupWithMessage/PopupWithMessage";
import { setPopupMessage } from "../redux/popupMessageSlice";
import { DARK, darkModeBackGround, serverMessages, ligthModeBackGround, LIGHT, darkColor, lightColor } from "../utils/constants";
import { Nav } from "../Nav/Nav";
import FormControlLabel from '@mui/material/FormControlLabel';
import { setVisibilityMode } from "../redux/visibilityModeSlice";
import { isLoading, setIsLoading } from "../redux/isLoadingSlice";
import { MaterialUISwitch } from "../utils/materialCustomStyles";
import { Containers } from "../Containers/Containers";


export default function App() {
  const [containers, setContainers] = useState([]);
  const [boards, setBoards] = useState([])
  const navigate = useNavigate()
  const [token, setToken] = useState(getCookie('token').token || '')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // const [conTitle, setConTitle] = useState("");
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.userInfo)
  const messageState = useSelector((state) => state.message)
  const visibilityMode = useSelector((state) => state.mode);
  const location = localStorage.getItem('location');




  const background = (visibilityMode === DARK) ? darkModeBackGround : ligthModeBackGround

  const color = (visibilityMode === DARK) ? darkColor : lightColor;
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
      default:

        dispatch(setPopupMessage({ message: 'Ooops something went wrong', severity: "error", isOpen: true }));
    }

  }, [])

  useEffect(() => {
    if (token) {
      Api.getUserInfo(token).then((user) => {
        if (user) {
          dispatch(setUserInfo(user))
          setBoards(user.boards)
          setIsLoggedIn(true)
          if (location) {
            navigate(location)
          }

          // navigate('/boards')
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

    Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, boards).then((userInfo) => {
      if (userInfo) {
        handleServerMessages('200')
      }
    }).catch((e) => handleServerMessages(e.message))
  }

  const handleAddContainer = (conTitle, boardId) => {
    // e.preventDefault();

    // const seq = containers.length;
    Api.createNewContainer(conTitle, token, [], boardId).then((container) => {
      if (container) {

        const newBoards = [...boards].map((b) => {
          if (b._id === boardId) {
            const newCons = [...b.containers, container]
            return { ...b, containers: newCons }
          }
          return b
        })
        Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, newBoards).then((userInfo) => {
          if (userInfo) {
            setBoards(newBoards)
            handleServerMessages('200')

          }
        }).catch((e) => handleServerMessages(e.message))

      }
    }).catch((e) => handleServerMessages(e.message))

    // setConTitle("");
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
    dispatch(setIsLoading(true))
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
    }).finally(() => {
      dispatch(setIsLoading(false))
    })
  }

  const handleLogOut = () => {
    deleteCookie('token')
    setIsLoggedIn(false)
    navigate('/')
    setToken('')
    setUserInfo({})
    setContainers([]);
    localStorage.removeItem('location')
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

  const handleDeleteContainer = (containerId, boardId, postSubmitCallBack) => {
    debugger
    dispatch(setIsLoading(true))

    const newBoards = [...boards].map((b) => {
      if (b._id === boardId) {
        const newContainers = [...b.containers].filter((c) => c._id !== containerId)
        return { ...b, containers: newContainers }
      }
      return b
    })

    Promise.all([Api.handleDeleteCon(token, containerId), Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, newBoards)]).then((data) => {
      if (data) {
        const userInfo = data[1];
        setBoards(userInfo.boards)
        dispatch(setUserInfo(userInfo))
        handleServerMessages('200')
        postSubmitCallBack();
      }
    }).catch((e) => handleServerMessages(e.message))
      .finally(() => {
        dispatch(setIsLoading(false))
      })

  };

  const handleChangeMode = () => {
    if (visibilityMode === DARK) {
      dispatch(setVisibilityMode(LIGHT))
    } else {
      dispatch(setVisibilityMode(DARK))
    }

  }

  const handleAddNewBoard = (title) => {
    dispatch(setIsLoading(true))
    Api.handleAddNewBoard(token, title)
      .then((board) => {
        const newBoards = [...boards, board]
        Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, newBoards).then((userInfo) => {
          if (userInfo) {
            setBoards(userInfo.boards)
            dispatch(setUserInfo(userInfo))
            handleServerMessages('200')
            dispatch(setIsLoading(false))
          }
        }).catch((e) => handleServerMessages(e.message))

      }).catch((e) => handleServerMessages(e.message))
      .finally(() => dispatch(setIsLoading(false)))
  }
  const handleDeleteBoard = (id, boardId, postSubmitHandler) => {

    dispatch(setIsLoading(true))

    const newBoards = [...boards].filter((b) => b._id !== id)
    Promise.all([Api.handleDeleteBoard(token, id), Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, newBoards)]).then((data) => {

      if (data) {
        const userInfo = data[1];
        setBoards(userInfo.boards)
        dispatch(setUserInfo(userInfo))
        handleServerMessages('200');
        postSubmitHandler();

      }
    }).catch((e) => handleServerMessages(e.message))
      .finally(() => dispatch(setIsLoading(false)))

  }

  const handleUpdateBoardInfo = (e, values, postCallBack) => {
    dispatch(setIsLoading(true))
    let containers;
    e.preventDefault()
    const newBoards = [...boards].map((b) => {
      if (b._id === values.id) {
        containers = [...b.containers];
        return { ...b, title: values.title, img: values.img }
      }
      return b
    })
    Promise.all([Api.handleUpdateBoard(token, values.id, values.title, containers, values.img), Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, newBoards)]).then((data) => {
      if (data) {
        setBoards(data[1].boards)
        dispatch(setUserInfo(data[1]))
        handleServerMessages('200');
        postCallBack()

      }
    }).catch((e) => handleServerMessages(e.message))
      .finally(() => {
        dispatch(setIsLoading(false))
      })
  }

  const handleUpdateUserProfile = (e, values, postSubmitCallBack, boards) => {

    e.preventDefault()
    dispatch(setIsLoading(true))
    Api.handleUpdateUserInfo(token, values.name, values.email, boards).then((userInfo) => {
      if (userInfo) {
        dispatch(setUserInfo(userInfo))
        handleServerMessages('200');
        postSubmitCallBack();

      }
    }).catch((e) => handleServerMessages(e.message))
      .finally(() => dispatch(setIsLoading(false)))

  }





  return (
    <div className="App justify-center h-screen w-screen" style={{ background: background, justifyContent: isLoggedIn && 'flex-start' }}>
      {isLoggedIn &&

        <Nav boards={boards} onUpdateUser={handleUpdateUserProfile} onSave={handleUpdateUserInfo} onLogOut={handleLogOut} />
      }

      <FormControlLabel
        className="absolute top-2 right-1"
        control={<MaterialUISwitch checked={visibilityMode === DARK} onChange={handleChangeMode} />}

      />
      <Routes>
        <Route path="/signup" element={<Register handleSubmit={handleRegistration} path='/' text='SignUp' btnText='Create' isRegisterFormOpen={true} subtitleText='Click Here To Log In' />} />
        <Route path="/" element={<Register handleSubmit={handleLogIn} text='Login' path='/signup' btnText='Log In' subtitleText='Click Here To Sign Up' isRegisterFormOpen={false} />} />
        <Route path="/boards" element={<ProtectedComponent
          Component={Boards}
          isLoggedIn={isLoggedIn}
          onLogOut={handleLogOut}
          onSave={handleUpdateUserInfo}
          // onDeleteCon={handleDeleteContainer}
          setBoards={setBoards}
          boards={boards}
          onAddBoard={handleAddNewBoard}
          handleDragItems={handleDragItems}
          onDelete={handleDeleteBoard}
          onUpdate={handleUpdateBoardInfo}
          onUpdateUser={handleUpdateUserInfo}

        />} />
        <Route path="/boards/:boardId/containers" element={<ProtectedComponent
          handleServerMessages={handleServerMessages}
          Component={Containers}
          isLoggedIn={isLoggedIn}
          onAddContainer={handleAddContainer}
          onLogOut={handleLogOut}
          onSave={handleUpdateUserInfo}
          onDeleteCon={handleDeleteContainer}
          setBoards={setBoards}
          boards={boards}
          token={token}


          // onAddBoard={handleAddNewBoard}
          handleDragItems={handleDragItems}
          onDelete={handleDeleteBoard}
          onUpdate={handleUpdateBoardInfo}
          onUpdateUser={handleUpdateUserProfile}


        />} />

      </Routes>

      {/* {
        isLoggedIn && <Foooter color={color} />
      } */}

      <PopupWithMessage isOpen={messageState.isOpen} message={messageState.message} severity={messageState.severity} />
    </div>
  );
}
