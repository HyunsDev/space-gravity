interface MousePos {
    x: number;
    y: number;
}

export function getMousePos (event: MouseEvent, div: HTMLElement | null): MousePos | undefined {
    if (!div) return
    return {
        x: event.pageX - div.offsetWidth/2 ,
        y: event.pageY - div.offsetHeight/2
    };
};