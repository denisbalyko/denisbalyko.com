(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;
    var STEPS = [{'dx': 1, 'dy': 0}, 
                 {'dx': 0, 'dy': 1}, 
                 {'dx':-1, 'dy': 0}, 
                 {'dx': 0, 'dy':-1}];

    /**
     * Функция находит путь к выходу и возвращает найденный маршрут
     *
     * @param {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param {number} x координата точки старта по оси X
     * @param {number} y координата точки старта по оси Y
     * @returns {[number, number][]} маршрут к выходу представленный списоком пар координат
     */
    function solution(maze, x, y) {

        var startNode = new Node(y, x, 0),
            endNode = findLastNode(maze),
            mazeMarked = performWaves(maze, startNode),
            path = backTrace(mazeMarked, startNode, endNode);

        root.maze.mazeMarked = mazeMarked;

        return path;
    }

    /**
     * Функция проверки не выходит ли точка с координатами за границы карты
     *
     * @param {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param {number} x координата точки по оси X
     * @param {number} y координата точки по оси Y
     * @returns {bool} возможно ли пройти?
     */
    function isValid(maze, x, y) {
        if (x >= 0 && 
            y >= 0 &&
            x < maze.length &&
            y < maze[0].length) {
            return true;
        }
        return false;
    }

    /**
     * Функция возвращает последнюю клетку пути
     *
     * @param {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @returns {Node} конечная клетка пути
     */
    function findLastNode(maze) {
        for (var i = maze[0].length - 1; i >= 0; i--) {
            if (maze[maze.length - 1][i] === EMPTY) {
                return new Node(maze.length - 1, i);
            }
        }
        throw "Ошибка: Отсутствие выхода.";
    }

    /**
     * Функция распространения волн алгоритма Ли
     *
     * @param {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param {Node} Начальная точка
     * @returns {number[][]} maze карта лабиринта с отмеченными волнами алгоритма Ли
     */
    function performWaves(maze, startNode) {

        var maze = copyMaze(maze), // Local scope
            Q = new Queue(startNode);

        maze[startNode.x][startNode.y] = 1;

        while (!Q.isEmpty()){
            var currentNode, xn, yn, xk, yk, i;

            currentNode = Q.dequeue(),
            xn = currentNode.x,
            yn = currentNode.y;

            for (i = STEPS.length - 1; i >= 0; i--) {
                xk = xn + STEPS[i].dx,
                yk = yn + STEPS[i].dy;
                if (isValid(maze, xk, yk) && maze[xk][yk] == EMPTY) {
                    nextNode = new Node(xk, yk, currentNode.value + 1, currentNode);
                    Q.enqueue(nextNode);
                    maze[xk][yk] = nextNode;
                }
            }

        }

        return maze;
    }

    /**
     * Функция обратного хода
     *
     * @param {number[][]} maze карта лабиринта с отмеченными волнами алгоритма Ли
     * @param {Node} начальная клетка пути
     * @param {Node} конечная клетка пути
     * @returns {[number, number][]} маршрут к выходу представленный списоком пар координат
     */
    function backTrace(mazeMarked, startNode, endNode) {
        var path = [],
            currentNode = mazeMarked[endNode.x][endNode.y];
            path.push([currentNode.y, currentNode.x]);

        while (typeof currentNode === 'object' && currentNode.objectName === 'Node'){
            path.push([currentNode.y, currentNode.x]);
            currentNode = currentNode.parent;
        }

        return path;
    }

    /**
     * Функция копирования лабиринта
     *
     * @param {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @returns {number[][]} clonedMaze скопированная карта либиринта
     */
    function copyMaze(maze) {
        var copiedMaze = [];
        maze.forEach(function (arr) {
            copiedMaze.push(arr.concat());
        });
        return copiedMaze;
    }

    /**
     * Клетка на карте
     */
    function Node(x, y, v, p) {
        this.x = x;
        this.y = y;
        this.value = v;
        this.parent = p;
        this.objectName = 'Node';
    }

    /**
     * Очередь
     */
    function Queue(Node){

        var queue  = [Node],
            offset = 0;

        // Размер очереди -> (int)
        this.getLength = function(){
            return (queue.length - offset);
        }

        // Пуста ли очередь? -> (bool)
        this.isEmpty = function(){
            return (queue.length == 0);
        }

        // Добавление в очередь нового item элемента:
        // (item) -> ()
        this.enqueue = function(item){
            queue.push(item);
        }

        // Возвращаем элемент из очереди.
        // () -> (item) | undefined
        this.dequeue = function(){
            if (queue.length == 0) return undefined;
            var item = queue[offset];
            if (++ offset * 2 >= queue.length){
              queue  = queue.slice(offset);
              offset = 0;
            }
            return item;
        }
    }

    root.maze.solution = solution;
})(this);
