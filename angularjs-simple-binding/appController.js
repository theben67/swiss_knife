function appController($scope){

  $scope.todoList = [];
  $scope.currentTodo = "";

  $scope.addTodo = function(){
    $scope.todoList.push($scope.currentTodo);
    $scope.currentTodo = "";
  }

  $scope.deleteTodo = function($index){
    $scope.todoList.splice($index,1);
  }
  
}
