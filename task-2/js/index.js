(function (root) {
    var map = root.maze.MAZE_Y;
    var path = root.maze.solution(map, 1, 0);

    document.querySelector('.outer').appendChild(
        root.maze.render(map, path)
    );

    document.querySelector('.animation.play').addEventListener("click", function (e) {
    	this.remove();
    	root.maze.animation(map, path);
    });

})(this);
