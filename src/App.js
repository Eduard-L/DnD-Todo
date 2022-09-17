import "./App.css";
import { Container } from "./Container.js";
import { useEffect, useState } from "react";
import { DndItem } from "./DndItem";
import { startContainers } from "./Data.js";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [containers, setContainers] = useState(startContainers);
  const [conTitle, setConTitle] = useState("");
  const [options, setOptions] = useState(['Done', 'Todo']);
  const [selectId, setSelectId] = useState(null)
  const [task, setTask] = useState("");
  const [disableDrag, setDisableDrag] = useState(true);



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
    setContainers([
      ...containers,
      { id: uuidv4(), title: conTitle, tasks: [] }
    ]);
    setConTitle("");
  };

  const handleAddTask = (e, id) => {
    e.preventDefault();
    if (!id) return

    const c = containers.find((c) => c.id === id);
    c.tasks.push({ id: uuidv4(), text: task, conId: id });
    let newCon = [...containers];
    newCon = newCon.filter((c) => c.id !== id);
    // console.log(c);
    newCon.push(c);
    newCon.sort((a, b) => a.id - b.id);
    // console.log(newCon);
    setContainers(newCon);
    setTask("");
  };

  const handleDragItem = (dragIndex, hoverIndex) => {

    // console.log(dragIndex)
    // console.log(hoverIndex)
    const newCont = [...containers];
    const dragItem = containers[dragIndex];
    if (!dragItem) return
    console.log(dragItem)

    newCont.splice(dragIndex, 1);
    newCont.splice(hoverIndex, 0, dragItem);
    console.log(newCont);
    setContainers(newCont);
  };

  return (
    <div className="App">
      <div className="form-wrapper">
        <form onSubmit={handleAddContainer} className="container-form">
          <input
            name="container-title"
            className="container-title"
            type="text"
            placeholder="container title"
            required
            value={conTitle}
            onChange={(e) => setConTitle(e.target.value)}
          />
          <button type="submit" className="add-container-btn">
            Add Container
          </button>
        </form>
        <form onSubmit={(e) => handleAddTask(e, selectId)} className="container-form">
          <input
            name="container-title"
            className="container-title"
            type="text"
            placeholder="container title"
            required
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button type="submit" className="add-container-btn">
            Add Task
          </button>
        </form>
      </div>
      <Autocomplete
        disableClearable
        id="combo-box-demo"
        options={[...options]}
        onChange={(event, newValue) => {
          handleChangeSelect(newValue);
        }}
        sx={{ width: 300, margin: "10px 0 10px 0" }}

        renderInput={(params) => (
          <TextField {...params} label="Choose Container" />
        )}
      />
      <div className="container-wrapper">
        {containers &&
          containers.map((c, index) => {
            return (
              <DndItem
                onHover={handleDragItem}
                Component="div"
                key={c.id}
                id={c.id}
                index={index}
                tasks={c.tasks}
                disAbleDrag={disableDrag}
                setDisbaleDrag={setDisableDrag}
                type="container"
              >
                <Container
                  onDisableDrag={setDisableDrag}
                  title={c.title}
                  tasks={c.tasks}
                  key={c.id}
                  id={c.id}
                  containers={containers}
                  setContainers={setContainers}
                />
              </DndItem>
            );
          })}
      </div>
    </div>
  );
}
