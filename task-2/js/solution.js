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
        // todo: построить правильный маршрут к выходу
        return [
            [1, 0],
            [1, 1]
        ];
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
     * @param {Queue} Исходная очередь
     * @returns {number[][]} maze карта лабиринта с отмеченными волнами алгоритма Ли
     */
    function performWaves(maze, Q) {
        var maze = maze;
        while (!Q.isEmpty()){
            var currentNode = Q.dequeue();
            var xn = currentNode.x;
            var yn = currentNode.y;

            for (var i = STEPS.length - 1; i >= 0; i--) {
                var xk = xn + STEPS[i].dx;
                var yk = yn + STEPS[i].dy;
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
        var path = []
        var currentNode = mazeMarked[endNode.x][endNode.y];

        while (typeof currentNode === 'object' && currentNode.objectName === 'Node'){
            path.push([currentNode.y, currentNode.x]);
            currentNode = currentNode.parent;
        }

        return path;
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

        var queue  = [Node];
        var offset = 0;

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
