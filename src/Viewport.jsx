
import Dino from './components/Dino'
import platformGvg from "./assets/platform.svg"
import littleCloud from "./assets/littleCloud.svg"
import bigCloud from "./assets/bigCloud.svg"

const Viewport = ({ x, y, width, height, playerY, rects, onClick }) => {
    const leftX = x - width / 2
    const rightX = x + width / 2
    const topY = y - height / 2
    const bottomY = y + height / 2

    return (
        <div
            className="viewport"
            style={{ width, height }}
            onClick={onClick}
        >
            <div
                className="mainCloud"
                style={{ width: 300, height: 300 }}
            >
                <img src={bigCloud}  />

            </div>
            <div
                className="topCloud"
                style={{ width: 300, height: 60 }}
            >
                <img src={littleCloud}  />

            </div>
            <div
                className="bottomCloud"
                style={{ width: 350, height: 60 }}
            >
                <img src={littleCloud}  />

            </div>
            <div
                className="viewport-inner"
                style={{ transform: `translate3d(${-leftX}px, ${-topY}px, 0)` }}
            >
                {
                    rects
                        .filter(([x0, y0, x1, y1]) => (x1 >= leftX) && (x0 <= rightX) && (y1 >= topY) && (y0 <= bottomY))
                        .map(([x0, y0, x1, y1], i) => (
                            <div
                                key={`${x0}-${y0}`}
                                className="rect"
                                style={{ left: x0, top: y0, width: x1 - x0, height: y1 - y0 }}
                            >
                                <img src={platformGvg}  />
                            </div>
                        ))
                }
            </div>
            <div
                className="player"
                style={{ transform: `translate3d(${width / 3}px, ${height / 2 + playerY - y}px, 0)` }}
            >
                <Dino

                    isStopped={false}
                    isPaused={false}
                />
            </div>
        </div>
    )
}

export default Viewport