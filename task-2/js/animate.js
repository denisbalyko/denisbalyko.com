(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;
    var ANIMATE_DELAY_1 = 50;
    var ANIMATE_DELAY_2 = 40;
    var ANIMATE_DELAY_3 = 30;


    /**
     * Создает пошаговую визуализацию выхода из лабиринта
     *
     * @param {number[][]} maze схема лабиринта
     * @param {[number, number][]} [path] маршрут
     * @returns {HTMLElement} HTML элемент
     */
    function animation(maze, path) {

        var funStack = [
            {'f': animationInit, 'd': 0},
            {'f': animationWaves, 'd': 1},
            {'f': animationPath, 'd': path.length * ANIMATE_DELAY_1},
            {'f': animationCurrent, 'd': path.length * (ANIMATE_DELAY_1+ANIMATE_DELAY_2)},
        ]

        for (var i = 0; i < funStack.length; i++) {
            setTimeout(
                function(f) {
                    f(maze, path)
                },
                funStack[i].d, funStack[i].f
            );
        }
    }

    /**
     * Подготовка среды
     *
     * @param {number[][]} maze схема лабиринта
     * @param {[number, number][]} [path] маршрут
     * @returns {HTMLElement} HTML элемент
     */
    function animationInit(maze, path) {
        document.querySelector('.maze__cell_current').classList.remove('maze__cell_current');
        var pathElements = document.querySelectorAll('.maze__cell_path');
        for (var i = 0; i < pathElements.length; i++) {
            pathElements.innerHTML = '';
            pathElements[i].classList.remove('maze__cell_path');
        }
    }

    /**
     * Создает пошаговую визуализацию волн
     *
     * @param {number[][]} maze схема лабиринта
     * @param {[number, number][]} [path] маршрут
     */
    function animationWaves(maze, path) {

        var mazeMarked = root.maze.mazeMarked;
        var mazeRows = document.querySelectorAll('.maze__row');

        for (y = 0; y < mazeMarked.length; y++) {
            row = mazeMarked[y];
            mazeRow = mazeRows[y];

            for (x = 0; x < row.length; x++) {
                var currentNode = row[x];

                if (typeof currentNode === 'object' && currentNode.objectName === 'Node'){

                    var mazeCurrentCell = mazeRow.querySelectorAll('.maze__cell')[x];

                    setTimeout(
                        function(mazeCurrentCell, currentNode){
                            return function(){
                                mazeCurrentCell.innerHTML = '<div>'+currentNode.value + '</div>';
                            }
                        }(mazeCurrentCell, currentNode), 
                        currentNode.value * ANIMATE_DELAY_1
                    );
                }
            }
        }
    }

    /**
     * Создает пошаговую визуализацию построения пути
     *
     * @param {number[][]} maze схема лабиринта
     * @param {[number, number][]} [path] маршрут
     */
    function animationPath(maze, path) {

        var mazeRows = document.querySelectorAll('.maze__row');

        for (var i = 0; i < path.length; i++) {
            var point = path[i];
            var x = point[0],
                y = point[1];

            mazeRow = mazeRows[y];
            mazeCurrentCell = mazeRow.querySelectorAll('.maze__cell')[x];

            setTimeout(
                function(mazeCurrentCell){
                    return function(){
                        mazeCurrentCell.innerHTML = '';
                        mazeCurrentCell.classList.add("maze__cell_path");
                    }
                }(mazeCurrentCell), 
                (i) * ANIMATE_DELAY_2
            );
        }
    }

    /**
     * Создает пошаговую визуализацию прохождения пути
     *
     * @param {number[][]} maze схема лабиринта
     * @param {[number, number][]} [path] маршрут
     */
    function animationCurrent(maze, path) {

        var mazeRows = document.querySelectorAll('.maze__row');

        for (var i = 0; i < path.length; i++) {
            var point = path[i];
            var x = point[0],
                y = point[1];

            mazeRow = mazeRows[y];
            mazeCurrentCell = mazeRow.querySelectorAll('.maze__cell')[x];

            setTimeout(
                function(mazeCurrentCell){
                    return function(){
                        var prev = document.querySelector('.maze__cell_current');
                        if (prev){
                            prev.classList.remove('maze__cell_current');
                        }
                        mazeCurrentCell.innerHTML = '';
                        mazeCurrentCell.classList.add("maze__cell_current");
                    }
                }(mazeCurrentCell), 
                (path.length - i) * ANIMATE_DELAY_3
            );
        }

    }

    root.maze.animation = animation;
})(this);