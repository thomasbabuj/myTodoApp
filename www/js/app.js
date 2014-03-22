

// Initializing the app
angular.module('todo', ['ionic'])  // Include the ionic module

	/* 
		The Projects factory handles saving and loading projects from local storage and also
		let us save and load the last active project index.
	*/

	.factory('Projects', function(){
		return {
			all : function() {
				var projectString = window.localStorage['projects'];
				if ( projectString ) {
					return angular.fromJson(projectString);
				}

				return [];
			}, 

			save : function(projects) {
				window.localStorage['projects'] = angular.toJson(projects);
			},

			newProject : function(projectTitle) {
				// Add a new project

				return {
					title : projectTitle,
					tasks : []
				};
			},

			getLastActiveIndex : function(){
				console.log ("Window LocalStorage ==" + window.localStorage['lastActiveProject']);
				return parseInt(window.localStorage['lastActiveProject']) || 0;
			},

			setLastActiveIndex : function(index) {
				window.localStorage['lastActiveProject'] = index;
			}
		}
	})

	.controller ('TodoCtrl', function($scope, $timeout, $ionicModal, Projects) {

		// A utility function for creating a new project with
		// the given projectTitle

		var createProject = function(projectTitle) {
			var newProject = Projects.newProject(projectTitle);
			$scope.projects.push(newProject);
			Projects.save($scope.projects);
			$scope.selectProject(newProject, $scope.projects.length -1);
		}

	
		$scope.taskButtons = [{
			text : 'Delete',
			type : 'button-assertive',
			onTap : function(task) {
				console.log ('Delete Task' + task.id);
			},
			onClick : function(task) {
				console.log ("delete onclick");
			}
		}];

$scope.deleteItemButton = [
{
text: 'Delete',
type: 'button-assertive',
onClick: function(item) {
alert('Edit Item: ' + item.id);
}
}];

		// Load or Initializze projects
		$scope.projects = Projects.all();

		/*console.log ("Type check " + typeof($scope.projects));
		console.log ($scope.projects);
		console.log ("Last active Index = " +Projects.getLastActiveIndex());
		console.log ("Scope Projects  " + $scope.projects);

		*/
		
		// Grab the last active, or the first project

		$scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];



		//console.log ($scope.activeProject.tasks[1].title = "task 1- office");

		//console.log( $scope.projects[Projects.getLastActiveIndex()].tasks = 
		
		//console.log ("Scope Active Project =" + $scope.activeProject);

		// Called to create a new project
		$scope.newProject = function() {
			var projectTitle = prompt('Project name');
			if (projectTitle) {
				createProject(projectTitle);
			}
		};

		$scope.selectProject = function(project, index) {
			$scope.activeProject = project;
			Projects.setLastActiveIndex(index);
			$scope.sideMenuController.close();
		};

		// Create our modal
		$ionicModal.fromTemplateUrl('new-task.html', function(modal){
			$scope.taskModal = modal;
		}, {
			scope : $scope
		});

		$scope.createTask = function(task) {
			if (!$scope.activeProject || !task) {
				return;
			}

			$scope.activeProject.tasks.push({
				title : task.title
			});

			$scope.taskModal.hide();

			Projects.save($scope.projects);

			task.title = "";
		};

		$scope.taskDelete = function(task) {
			
			console.log ("Task Id " + task );

			//$scope.activeProject.tasks.splice ( $scope.activeProject.tasks.indexOf(0), 1);


		}


		$scope.markCompleted = function(task) {
					
			var currentProjectTask = $scope.activeProject.tasks;
					
			currentProjectTask.splice ( currentProjectTask.indexOf(task), 1);

			console.log ($scope.projects[Projects.getLastActiveIndex()].tasks );

			//console.log ($scope.activeProject.title);

			Projects.save($scope.projects);



		}


		$scope.newTask = function() {
			$scope.taskModal.show();
		}

		$scope.closeNewTask = function() {
			$scope.taskModal.hide();
		}

		$scope.toggleProjects = function() {
			$scope.sideMenuController.toggleLeft();
		};


		// Try to create the first project, make sure to defer
		// this by using $timeout so everything is initialized
		// properly

		$timeout(function() {
			if ($scope.projects.length == 0) {
				while( true ) {
					var projectTitle = prompt('Your First project title :');
					if ( projectTitle ) {
						createProject(projectTitle);
						break;
					}
				}
			}
		});






		/*$scope.tasks = [
			{ title : 'Collect coins' },
			{ title : 'Eat mushrooms'},
			{ title : 'Get high enough to grab the flag'},
			{ title : 'Find the Princess'}
		]; 

		$scope.tasks = [];

		// Create and load the Model
		$ionicModal.fromTemplateUrl('new-task.html', function(modal){
			$scope.taskModal = modal;
			console.log ( modal );
		}, {
			scope : $scope,
			animation : 'slide-in-up'
		});

		// Called when the form is submitted
		$scope.createTask = function(task) {
			$scope.tasks.push({
				title : task.title
			});
			$scope.taskModal.hide();
			task.title ="";
		};

		// Open our new task model
		$scope.newTask = function(){
			$scope.taskModal.show();
		}

		$scope.closeNewTask = function() {
			$scope.taskModal.hide();
		}  */

	});


