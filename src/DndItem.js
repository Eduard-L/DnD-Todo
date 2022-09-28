import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import React from "react";
const ItemTypes = {
    ITEM: "item"
};

export const DndItem = React.memo(({
    Component,
    _id,
    index,
    children,
    onHover,
    className,
    disAbleDrag,
    handleDropItems,
    setDisbaleDrag,
    type,
    task,
    container,
    onDragToDiffCon,
    title
}) => {
    const ref = useRef(null);
    let opacity;
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: type,
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        }),

        hover(item, monitor) {
            // console.log(item)
            // console.log(ref.current)
            if (!ref.current) {
                return;
            }
            if (container !== item.container) {


                onDragToDiffCon(item, container, _id)
                opacity = 0;
                // opacity = isOver ? 0 : 1;
                item.container = container
                item.index = index


                return item
            }


            const dragIndex = item.index;
            const hoverIndex = index;
            // console.log(dragIndex)
            if (dragIndex === hoverIndex) {

                return;
            }

            if (isOver) {

                onHover(dragIndex, hoverIndex);

                item.index = hoverIndex;
            }
        },
        drop: () => {
            // if (handleDropItems) {
            //     handleDropItems(setDisbaleDrag);
            // }
            // if (setDisbaleDrag) {
            //     setDisbaleDrag(true);
            // }
        }
    });

    const [{ isDragging }, drag] = useDrag({
        type: type,
        item: () => {
            return { _id, index, container, title };
        },
        canDrag: () => {
            if (disAbleDrag) {
                return false;
            }
            return true;
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
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
