import { useState, useEffect, useRef } from 'react';

import RequestList from './features/requestList/RequestList';
import RequestMap from './features/requestMap/RequestMap';

import { Layout } from 'antd';

import 'antd/dist/antd.min.css';
import './App.css';

const { Header, Content } = Layout;

function App() {
	const tableWrapper = useRef();
    const [size, setSize] = useState(null);

    useEffect(() => {
        if (tableWrapper && tableWrapper.current) {
            setSize({x: tableWrapper.current.clientWidth});
        }
    }, [tableWrapper.current]);

	const handler = (mouseDownEvent) => {
        if (!size) {
            return;
        }
        const startSize = size;
        const startPosition = { x: mouseDownEvent.pageX };
        
        function onMouseMove(mouseMoveEvent) {
          setSize((currentSize) => ({ 
            x: startSize.x - startPosition.x + mouseMoveEvent.pageX
          }));
        }
        function onMouseUp() {
          document.body.removeEventListener("mousemove", onMouseMove);
        }
        
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp, { once: true });
      };

	const minWrapperSize = window.screen.width / 100 * 30;
    let wrapperSize = size ? { width: size.x } : null;
	if (size && size.x < minWrapperSize) {
		setSize((currentSize) => ({
			x: minWrapperSize
		}));
	}

	return (
		<Layout>
			<Header>Andrey Andreev - React developer</Header>
			<Content>
				<div className='table-wrapper' ref={tableWrapper} style={wrapperSize}>
					<RequestList />
					<button id="draghandle" type="button" onMouseDown={handler} />
				</div>
				<RequestMap />
			</Content>
		</Layout>
	);
}

export default App;
