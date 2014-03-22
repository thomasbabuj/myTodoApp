

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

	    }];

		// Load or Initializze projects
		$scope.projects = Projects.all();
		
		// Grab the last active, or the first project
		$scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

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

});


