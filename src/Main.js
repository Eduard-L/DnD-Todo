import { DndItem } from "./DndItem";
import { Container } from "./Container.js";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Nav } from "./Nav";



export const Main = ({ ...props }) => {
    const { onDeleteCon, onSave, onLogOut, userInfo, disableDrag, handleAddContainer, containers, conTitle, setConTitle, handleDragItem, setDisableDrag, setContainers, selectId, options, handleChangeSelect, token } = props



    return (
        <div className="w-full h-full">
            <Nav onSave={onSave} onLogOut={onLogOut} userInfo={userInfo} />
            <div className="form-wrapper">
                <form onSubmit={handleAddContainer} className="form container-form">
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
                    containers?.map((c, index) => {
                        return (
                            <DndItem
                                onHover={handleDragItem}
                                Component="div"
                                key={c?._id}
                                id={c?._id}
                                index={index}
                                tasks={c?.tasks}
                                disAbleDrag={disableDrag}
                                setDisbaleDrag={setDisableDrag}
                                type="container"
                            >
                                <Container
                                    onDisableDrag={setDisableDrag}
                                    title={c?.title}
                                    tasks={c?.tasks}
                                    key={c?._id}
                                    id={c?._id}
                                    containers={containers}
                                    setContainers={setContainers}
                                    token={token}
                                    onDelete={onDeleteCon}
                                />
                            </DndItem>
                        );
                    })}
            </div>

        </div>

    )





}