import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import React from "react";


export const DropContainer = React.memo(({
    Component,
    id,
    index,
    children,
    onHover,
    className,
    handleDropItems,
    setDisbaleDrag,
    type,

}) => {
    const ref = useRef(null);

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
            // console.log(item)

            const dragIndex = id;
            const hoverIndex = index;

            // onHover(dragIndex, hoverIndex, item);


            if (dragIndex === hoverIndex) {
                return;
            }

            // if (isOver) {


            // item.index = hoverIndex;
            // }
        },
        drop: (x, y) => {
            handleDropItems(x, y);
            console.log(id)
            console.log(`dropped ${id}`)
        }
    });


    drop(ref)
    // const opacity = isDragging ? 0 : 1;
    // // const opacity= isOver  ? 0 : 1

    return (
        <Component
            // onMouseDown={onMouseDown}
            ref={ref}
            className={`dropable ${className}`}
            style={{ width: '100%', height: "100%" }}
        >
            {children}
        </Component>
    );
});
