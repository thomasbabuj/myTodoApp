

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


		$scope.taskButtons = [
	    {
	      text: 'Delete',
	      type: 'button-assertive',
	      onTap: function(task) {
		        var currentProjectTask = $scope.activeProject.tasks;
				currentProjectTask.splice ( currentProjectTask.indexOf(task), 1);
				Projects.save($scope.projects);
	      }

	    },

	    {
	      text: 'Edit',
	      type: 'button-calm',
	      onTap: function(task) {
	        	$scope.onEditTask (task);
	      }
	    }

	    ];

		// Load or Initializze projects
		$scope.projects = Projects.all();

		$scope.currentProjectTaskId  = {};
		
		// Grab the last active, or the first project
		$scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

		//$scope.taskLength = $scope.activeProject.tasks.length;
		

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

		$ionicModal.fromTemplateUrl('edit-task.html', function(modal){
			$scope.editModal = modal;
		}, {
			scope : $scope	
		});

		$ionicModal.fromTemplateUrl('task-details.html', function(modal){
			$scope.taskDetailsModal = modal;
		} , {
			scope : $scope
		});

		$scope.createTask = function(task) {

			if (!$scope.activeProject || !task) {
				return;
			}

			$scope.activeProject.tasks.push({
				title : task.title,
				reminder : task.remainder,
				when : task.when,
				description : task.description
			});

			$scope.taskModal.hide();

			Projects.save($scope.projects);

			task.title = ""; 
		};


		$scope.newTask = function() {
			$scope.task.title = "";
			$scope.task.reminder = false;
			$scope.task.when = "";
			$scope.task.description = "";
			$scope.taskModal.show();
		}

		$scope.onEditTask = function(task){

			var currentProjectTask = $scope.activeProject.tasks;
			 $scope.currentProjectTaskId = currentProjectTask.indexOf(task); 
			 $scope.task = { title : task.title, reminder : task.reminder, when : task.when, description : task.description };
			 $scope.editModal.show();
		}

		$scope.editSaveTask = function(task) {

			$scope.activeProject.tasks[$scope.currentProjectTaskId].title = task.title;


			$scope.activeProject.tasks[$scope.currentProjectTaskId].reminder = task.reminder;

			if ( task.reminder ) {
				$scope.activeProject.tasks[$scope.currentProjectTaskId].when = task.when;
			} else {
				$scope.activeProject.tasks[$scope.currentProjectTaskId].when = "";
			}

			$scope.activeProject.tasks[$scope.currentProjectTaskId].description = task.description;

			$scope.editModal.hide();
			Projects.save($scope.projects);
			task.title = "";
			task.reminder = "";
			task.when = "";
			task.description = "";
			 //$scope.projects[0].tasks[$scope.currentProjectTaskId].title
		}

		$scope.capitaliseFirstLetter = function(string) {
			return string.charAt(0).toUpperCase()+ string.slice(1);
		}

		$scope.showTaskDetail = function(task) {
			$scope.task = task;
			$scope.taskDetailsModal.show();
		}

		$scope.closeNewTask = function() {
			$scope.taskModal.hide();
		}
		$scope.closeEditTask = function() {
			$scope.editModal.hide();
		}

		$scope.closeTaskDetail = function() {
			$scope.taskDetailsModal.hide();
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

});


