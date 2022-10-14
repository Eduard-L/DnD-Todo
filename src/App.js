import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Register } from "./Register";
import { Api } from "./utils/myApi";
import { useNavigate } from "react-router-dom";
import { deleteCookie, getCookie, setCookie } from "./utils/handleCookies";
import { ProtectedComponent } from "./ProtectedComponent";
import { Main } from "./Main";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "./redux/userInfoSlice";
import { PopupWithMessage } from "./PopupWithMessage";
import { setPopupMessage } from "./redux/popupMessageSlice";
import { DARK, darkModeBackGround, serverMessages, ligthModeBackGround, LIGHT } from "./utils/constants";
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { setVisibilityMode } from "./redux/visibilityModeSlice";
import { PreLoader } from "./PreLoader/PreLoader";
import { setIsLoading } from "./redux/isLoadingSlice";


const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',

      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    border: '1px solid white',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));



export default function App() {
  const [containers, setContainers] = useState([]);
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
      Api.getUserInfo(token).then((userInfo) => {

        if (userInfo) {
          setUserInfo(userInfo)
          dispatch(setUserInfo(userInfo))
          setIsLoggedIn(true)
          setContainers(userInfo.containers)
          navigate('/containers')

        }
        else {

          setIsLoggedIn(false)
          setUserInfo({})
          setContainers([])
          navigate('/')

        }
      }).catch((e) => {
        handleLogOut()
        handleServerMessages(e.message)
      })
    }

  }, [token]);

  const handleUpdateUserInfo = () => {

    console.log('1')
    Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, containers).then((userInfo) => {
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
        navigate('/containers')
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



  return (
    <div className="App justify-center h-screen w-screen" style={{ background: background }}>

      <FormControlLabel
        className="absolute top-2 right-1"
        control={<MaterialUISwitch checked={visibilityMode === DARK} onChange={handleChangeMode} />}

      />
      <Routes>
        <Route path="/signup" element={<Register handleSubmit={handleRegistration} path='/' text='SignUp' btnText='Create' isRegisterFormOpen={true} subtitleText='Click Here To Log In' />} />
        <Route path="/" element={<Register handleSubmit={handleLogIn} text='Login' path='/signup' btnText='Log In' subtitleText='Click Here To Sign Up' isRegisterFormOpen={false} />} />
        <Route path="/containers" element={<ProtectedComponent
          Component={Main}
          isLoggedIn={isLoggedIn}
          handleAddContainer={handleAddContainer}
          conTitle={conTitle}
          setConTitle={setConTitle}
          handleAddTask={handleAddTask}
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

      <PopupWithMessage isOpen={messageState.isOpen} message={messageState.message} severity={messageState.severity} />
    </div>
  );
}
