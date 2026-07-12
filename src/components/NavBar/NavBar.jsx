import React, { Component } from "react";
import "./NavBar.css";


class NavBar extends Component {


    // ATTRIBUTES (i.e., State):

    state = {
        maze: "Generate Maze",
        pathState: false,
        mazeState: false,
        speedValue: 3,        // 1=Slow, 2=Medium, 3=Fast
        algoDropOpen: false,
        mazeDropOpen: false,
    };


    // LIFECYCLE:

    componentDidMount() {
        document.addEventListener("click", this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleOutsideClick);
    }

    handleOutsideClick = (e) => {
        if (!e.target.closest(".custom-dropdown")) {
            this.setState({ algoDropOpen: false, mazeDropOpen: false });
        }
    };


    // METHODS:

    selectAlgorithm(selection) {

        if (this.props.visualizingAlgorithm) return;

        this.setState({ algoDropOpen: false });

        if (selection === this.props.algorithm ||
            this.props.algorithm === "Visualize Algorithm" ||
            this.props.algorithm === "Select an Algorithm!") {

            this.props.updateAlgorithm(selection);

        } else if (this.state.pathState) {

            this.clearPath();
            this.props.updateAlgorithm(selection);

        } else {

            this.props.updateAlgorithm(selection);

        }

    }

    selectMaze(selection) {

        if (this.props.visualizingAlgorithm || this.props.generatingMaze) return;

        this.setState({ mazeDropOpen: false });

        if (selection === this.state.maze ||
            this.state.maze === "Generate Maze" ||
            this.state.maze === "Select a Maze!") {

            this.setState({ maze: selection });

        } else if (!this.state.mazeState) {

            this.setState({ maze: selection });

        } else {

            this.clearGrid();
            this.setState({ maze: selection });

        }

    }

    visualizeAlgorithm() {

        if (this.props.visualizingAlgorithm || this.props.generatingMaze) return;

        if (this.state.pathState) {
            this.clearTemp();
            return;
        }

        if (this.props.algorithm === "Visualize Algorithm" || this.props.algorithm === "Select an Algorithm!") {

            this.props.updateAlgorithm("Select an Algorithm!");

        } else {

            this.setState({ pathState: true });

            if (this.props.algorithm === "Visualize Dijkstra")                  this.props.visualizeDijkstra();
            else if (this.props.algorithm === "Visualize A*")                   this.props.visualizeAStar();
            else if (this.props.algorithm === "Visualize Greedy BFS")           this.props.visualizeGreedyBFS();
            else if (this.props.algorithm === "Visualize Bidirectional Greedy") this.props.visualizeBidirectionalGreedySearch();
            else if (this.props.algorithm === "Visualize Breadth First Search") this.props.visualizeBFS();
            else if (this.props.algorithm === "Visualize Depth First Search")   this.props.visualizeDFS();
            else if (this.props.algorithm === "Visualize Random Walk")          this.props.visualizeRandomWalk();

        }

    }

    generateMaze() {

        if (this.props.visualizingAlgorithm || this.props.generatingMaze) return;

        if (this.state.mazeState || this.state.pathState) this.clearTemp();

        if (this.state.maze === "Generate Maze" || this.state.maze === "Select a Maze!") {

            this.setState({ maze: "Select a Maze!" });

        } else {

            this.setState({ mazeState: true });

            if (this.state.maze === "Generate Random Maze")        this.props.generateRandomMaze();
            else if (this.state.maze === "Generate Recursive Maze") this.props.generateRecursiveDivisionMaze();
            else if (this.state.maze === "Generate Vertical Maze")  this.props.generateVerticalMaze();
            else if (this.state.maze === "Generate Horizontal Maze") this.props.generateHorizontalMaze();

        }

    }

    clearGrid() {

        if (this.props.visualizingAlgorithm || this.props.generatingMaze) return;

        this.props.clearGrid();

        this.setState({
            maze: "Generate Maze",
            pathState: false,
            mazeState: false,
        });

    }

    clearPath() {

        if (this.props.visualizingAlgorithm || this.props.generatingMaze) return;

        this.props.clearPath();

        this.setState({
            pathState: false,
            mazeState: false,
        });

    }

    clearTemp() {

        if (this.props.visualizingAlgorithm || this.props.generatingMaze) return;

        this.props.clearGrid();

        this.setState({
            pathState: false,
            mazeState: false,
        });

    }

    changeSpeed(val) {

        if (this.props.visualizingAlgorithm || this.props.generatingMaze) return;

        const speedValue = parseInt(val, 10);
        this.setState({ speedValue });

        let path, maze;
        if (speedValue === 1)      { path = 50; maze = 30; }
        else if (speedValue === 2) { path = 25; maze = 20; }
        else                       { path = 10; maze = 10; }

        this.props.updateSpeed(path, maze);

    }


    // ---- Label helpers ----

    getSpeedLabel() {
        switch (this.state.speedValue) {
            case 1:  return "Slow";
            case 2:  return "Medium";
            default: return "Fast";
        }
    }

    getRunButtonText() {
        if (this.props.visualizingAlgorithm) return "Running…";
        if (this.props.algorithm === "Visualize Algorithm" ||
            this.props.algorithm === "Select an Algorithm!") return "▶ Visualize";
        return `▶ ${this.props.algorithm.replace("Visualize ", "")}`;
    }

    getAlgoLabel() {
        if (this.props.algorithm === "Visualize Algorithm" ||
            this.props.algorithm === "Select an Algorithm!") return "Algorithms";
        return this.props.algorithm.replace("Visualize ", "");
    }

    getMazeLabel() {
        if (this.state.maze === "Generate Maze" || this.state.maze === "Select a Maze!") return "Mazes";
        return this.state.maze.replace("Generate ", "");
    }


    // MAIN RENDER:

    render() {

        const { algoDropOpen, mazeDropOpen } = this.state;
        const busy         = this.props.visualizingAlgorithm || this.props.generatingMaze;
        const algoSelected = this.props.algorithm !== "Visualize Algorithm" && this.props.algorithm !== "Select an Algorithm!";
        const mazeSelected = this.state.maze !== "Generate Maze" && this.state.maze !== "Select a Maze!";
        const hasStats     = this.props.visitedCount > 0 || this.props.pathLength > 0;

        return (

            <nav className="ms-navbar">

                {/* ---- Brand ---- */}
                <a className="ms-brand" href="https://github.com/NMPoole/MazeSolver"
                   target="_blank" rel="noreferrer">

                    <svg className="ms-brand-icon" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h6M15 9h6M9 9v6M15 15H9M15 9v6" />
                    </svg>

                    <span className="ms-brand-text">
                        {window.innerWidth > 700 ? "Maze Solver" : "MS"}
                    </span>

                </a>

                {/* ---- Controls ---- */}
                <div className="ms-controls">

                    {/* Algorithm dropdown */}
                    <div className={`custom-dropdown${algoDropOpen ? " open" : ""}`}>

                        <button
                            className={`ms-btn ms-btn-ghost${algoSelected ? " selected" : ""}`}
                            id="algo-dropdown-btn"
                            onClick={() => this.setState({ algoDropOpen: !algoDropOpen, mazeDropOpen: false })}
                            disabled={busy}
                        >
                            {this.getAlgoLabel()}
                            <span className="ms-chevron">▾</span>
                        </button>

                        <div className="ms-dropdown-menu" aria-labelledby="algo-dropdown-btn">

                            <div className="ms-dropdown-section">Weighted</div>

                            <button className="ms-dropdown-item" onClick={() => this.selectAlgorithm("Visualize Dijkstra")}>
                                <span className="item-dot dot-dijkstra"></span>
                                Dijkstra's Search
                                <span className="item-tag">Shortest Path</span>
                            </button>

                            <button className="ms-dropdown-item" onClick={() => this.selectAlgorithm("Visualize A*")}>
                                <span className="item-dot dot-astar"></span>
                                A* Search
                                <span className="item-tag">Shortest Path</span>
                            </button>

                            <button className="ms-dropdown-item" onClick={() => this.selectAlgorithm("Visualize Greedy BFS")}>
                                <span className="item-dot dot-greedy"></span>
                                Greedy Best First
                                <span className="item-tag">Heuristic</span>
                            </button>

                            <button className="ms-dropdown-item" onClick={() => this.selectAlgorithm("Visualize Bidirectional Greedy")}>
                                <span className="item-dot dot-bidir"></span>
                                Bidirectional Greedy
                                <span className="item-tag">Bidir</span>
                            </button>

                            <div className="ms-dropdown-divider"></div>
                            <div className="ms-dropdown-section">Unweighted</div>

                            <button className="ms-dropdown-item" onClick={() => this.selectAlgorithm("Visualize Breadth First Search")}>
                                <span className="item-dot dot-bfs"></span>
                                Breadth First Search
                                <span className="item-tag">Shortest Path</span>
                            </button>

                            <button className="ms-dropdown-item" onClick={() => this.selectAlgorithm("Visualize Depth First Search")}>
                                <span className="item-dot dot-dfs"></span>
                                Depth First Search
                                <span className="item-tag">No Guarantee</span>
                            </button>

                            <button className="ms-dropdown-item" onClick={() => this.selectAlgorithm("Visualize Random Walk")}>
                                <span className="item-dot dot-random"></span>
                                Random Walk
                                <span className="item-tag">Random</span>
                            </button>

                        </div>

                    </div>

                    {/* Run button — spinning rainbow border wrapper */}
                    <div className="ms-btn-run-border">
                        <button
                            className={`ms-btn ms-btn-run${this.props.visualizingAlgorithm ? " running" : ""}${this.state.pathState && !this.props.visualizingAlgorithm ? " done" : ""}`}
                            id="visualize-btn"
                            onClick={() => this.visualizeAlgorithm()}
                            disabled={this.props.generatingMaze}
                        >
                            <span className="run-shimmer"></span>
                            {this.getRunButtonText()}
                        </button>
                    </div>

                    {/* Loading dots — shown while running */}
                    {this.props.visualizingAlgorithm && (
                        <div className="ms-loading-dots" aria-label="Running">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}

                    {/* Maze dropdown */}
                    <div className={`custom-dropdown${mazeDropOpen ? " open" : ""}`}>

                        <button
                            className={`ms-btn ms-btn-ghost${mazeSelected ? " selected" : ""}`}
                            id="maze-dropdown-btn"
                            onClick={() => this.setState({ mazeDropOpen: !mazeDropOpen, algoDropOpen: false })}
                            disabled={busy}
                        >
                            {this.getMazeLabel()}
                            <span className="ms-chevron">▾</span>
                        </button>

                        <div className="ms-dropdown-menu" aria-labelledby="maze-dropdown-btn">

                            <div className="ms-dropdown-section">Maze Type</div>

                            <button className="ms-dropdown-item" onClick={() => this.selectMaze("Generate Random Maze")}>
                                <span className="item-dot dot-random"></span>
                                Random Maze
                            </button>

                            <button className="ms-dropdown-item" onClick={() => this.selectMaze("Generate Recursive Maze")}>
                                <span className="item-dot dot-dijkstra"></span>
                                Recursive Division
                            </button>

                            <button className="ms-dropdown-item" onClick={() => this.selectMaze("Generate Vertical Maze")}>
                                <span className="item-dot dot-bfs"></span>
                                Vertical Division
                            </button>

                            <button className="ms-dropdown-item" onClick={() => this.selectMaze("Generate Horizontal Maze")}>
                                <span className="item-dot dot-astar"></span>
                                Horizontal Division
                            </button>

                        </div>

                    </div>

                    {/* Generate maze button */}
                    <button
                        className="ms-btn ms-btn-maze"
                        id="generate-maze-btn"
                        onClick={() => this.generateMaze()}
                        disabled={busy}
                    >
                        ⬛ {mazeSelected ? this.state.maze.replace("Generate ", "") : "Generate"}
                    </button>

                    {/* Clear Grid */}
                    <button
                        className="ms-btn ms-btn-danger"
                        id="clear-grid-btn"
                        onClick={() => this.clearGrid()}
                        disabled={busy}
                    >
                        ✕ Clear
                    </button>

                    {/* Speed slider */}
                    <div className="ms-speed-control">
                        <span className="ms-speed-label">⚡ Speed: {this.getSpeedLabel()}</span>
                        <input
                            type="range"
                            id="speed-slider"
                            min="1" max="3" step="1"
                            value={this.state.speedValue}
                            className="ms-speed-slider"
                            onChange={(e) => this.changeSpeed(e.target.value)}
                            disabled={busy}
                        />
                    </div>

                </div>

                {/* ---- Live Stats bar ---- */}
                {hasStats && (
                    <div className="ms-stats-bar">

                        <div className="ms-stat">
                            <span className="stat-icon">◉</span>
                            <span className="stat-label">Visited</span>
                            <span className="stat-value">{this.props.visitedCount}</span>
                        </div>

                        <div className="ms-stat">
                            <span className="stat-icon">★</span>
                            <span className="stat-label">Path Length</span>
                            <span className="stat-value">{this.props.pathLength === 0 ? "—" : this.props.pathLength}</span>
                        </div>

                        <div className={`ms-stat ms-stat-status ${this.props.pathLength > 0 ? "found" : "notfound"}`}>
                            <span className="stat-icon">{this.props.pathLength > 0 ? "✓" : "✗"}</span>
                            <span className="stat-label">{this.props.pathLength > 0 ? "Path Found" : "No Path"}</span>
                        </div>

                    </div>
                )}

            </nav>

        );

    }


}

export default NavBar;