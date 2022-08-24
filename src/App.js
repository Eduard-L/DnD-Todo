import "./App.css";
import { Container } from "./Container.js";
import { useEffect, useState } from "react";
import { DndItem } from "./DndItem";
import { startContainers } from "./Data.js";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function App() {
  const [containers, setContainers] = useState(startContainers);
  const [conTitle, setConTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [task, setTask] = useState("");
  const [disableDrag, setDisableDrag] = useState(true);

  // console.log("rerendering");
  useEffect(() => {
    if (!containers) return;
    let newOptions = [];
    containers.forEach((c) => {
      newOptions.push(c.id.toString());
    });
    setOptions(newOptions);
  }, []);

  const handleAddContainer = (e) => {
    e.preventDefault();
    setContainers([
      ...containers,
      { id: containers.length, title: conTitle, tasks: [] }
    ]);
    setConTitle("");
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const c = containers.find((c) => c.id === 1);
    c.tasks.push({ id: c.tasks.length + 100, text: task });
    let newCon = [...containers];
    newCon = newCon.filter((c) => c.id !== 1);
    console.log(c);
    newCon.push(c);
    newCon.sort((a, b) => a.id - b.id);
    console.log(newCon);
    setContainers(newCon);
    setTask("");
  };

  const handleDragItem = (dragIndex, hoverIndex) => {

    console.log(dragIndex)
    console.log(hoverIndex)
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
        <form onSubmit={handleAddTask} className="container-form">
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
