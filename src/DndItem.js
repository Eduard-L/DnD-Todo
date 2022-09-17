import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import React from "react";
const ItemTypes = {
    ITEM: "item"
};

export const DndItem = React.memo(({
    Component,
    id,
    index,
    children,
    onHover,
    className,
    disAbleDrag,
    handleDropItems,
    setDisbaleDrag,
    type,
    task,
    conId,
    onDragToDiffCon,
    text
}) => {
    const ref = useRef(null);
    let opacity;
    const [{ isOver }, drop] = useDrop({
        accept: type,
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        }),

        hover(item, monitor) {


            if (!ref.current) {
                return;
            }
            if (conId !== item.conId) {


                onDragToDiffCon(item, conId, id)
                opacity = isOver ? 0 : 1;
                item.conId = conId
                item.index = index
                console.log(index)
                console.log(item)

                return
            }


            const dragIndex = item.index;
            const hoverIndex = index;
            // console.log(dragIndex)
            if (dragIndex === hoverIndex) {

                return;
            }



            if (isOver) {
                console.log(dragIndex, hoverIndex)

                onHover(dragIndex, hoverIndex);

                item.index = hoverIndex;
            }
        },
        drop: () => {
            if (handleDropItems) {
                handleDropItems(setDisbaleDrag);
            }
            if (setDisbaleDrag) {
                setDisbaleDrag(true);
            }
        }
    });

    const [{ isDragging }, drag] = useDrag({
        type: type,
        item: () => {
            return { id, index, conId, text };
        },
        canDrag: () => {
            if (disAbleDrag) {
                return false;
            }
            return true;
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    opacity = isDragging ? 0 : 1;
    // const opacity = isOver ? 0 : 1

    drag(drop(ref));
    return (
        <Component
            // onMouseDown={onMouseDown}
            ref={ref}
            className={`dropable ${className}`}
            style={{
                opacity: opacity
            }}
        >
            {children}
        </Component>
    );
});
