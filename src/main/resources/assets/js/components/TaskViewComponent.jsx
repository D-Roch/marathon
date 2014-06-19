/** @jsx React.DOM */

define([
  "React",
  "jsx!components/TaskListComponent"
], function(React, TaskListComponent) {
  "use strict";

  return React.createClass({
    displayName: "TaskViewComponent",
    getInitialState: function() {
      return {
        selectedTasks: {}
      };
    },
    getResource: function() {
      return this.props.collection;
    },
    killSelectedTasks: function(options) {
      var _options = options || {};

      var selectedTaskIds = Object.keys(this.state.selectedTasks);
      var tasksToKill = this.props.collection.filter(function(task) {
        return selectedTaskIds.indexOf(task.id) >= 0;
      });

      tasksToKill.forEach(function(task) {
        task.destroy({
          scale: _options.scale,
          success: function () {
            this.props.onTasksKilled(_options);
            delete this.state.selectedTasks[task.id];
          }.bind(this),
          wait: true
        });
      }, this);
    },
    killSelectedTasksAndScale: function() {
      this.killSelectedTasks({scale: true});
    },
    toggleAllTasks: function() {
      var newSelectedTasks = {};
      var modelTasks = this.props.collection;

      // Note: not an **exact** check for all tasks being selected but a good
      // enough proxy.
      var allTasksSelected = Object.keys(this.state.selectedTasks).length ===
        modelTasks.length;

      if (!allTasksSelected) {
        modelTasks.map(function(task) { newSelectedTasks[task.id] = true; });
      }

      this.setState({selectedTasks: newSelectedTasks});
    },
    onTaskToggle: function(task, value) {
      var selectedTasks = this.state.selectedTasks;

      // If `toggleTask` is used as a callback for an event handler, the second
      // parameter will be an event object. Use it to set the value only if it
      // is a Boolean.
      var localValue = (typeof value === Boolean) ?
        value :
        !selectedTasks[task.id];

      if (localValue === true) {
        selectedTasks[task.id] = true;
      } else {
        delete selectedTasks[task.id];
      }

      this.setState({selectedTasks: selectedTasks});
    },
    render: function() {
      var selectedTasksLength = Object.keys(this.state.selectedTasks).length;
      var buttons;
      if (selectedTasksLength === 0) {
        buttons =
          <p>
            <button className="btn btn-sm btn-info" onClick={this.props.fetchTasks}>
              ↻ Refresh
            </button>
          </p>;
      } else {
        // Killing two tasks in quick succession raises an exception. Disable
        // "Kill & Scale" if more than one task is selected to prevent the
        // exception from happening.
        //
        // TODO(ssorallen): Remove once
        //   https://github.com/mesosphere/marathon/issues/108 is addressed.
        buttons =
          <p className="btn-group">
            <button className="btn btn-sm btn-info" onClick={this.killSelectedTasks}>
              Kill
            </button>
            <button className="btn btn-sm btn-info" disabled={selectedTasksLength > 1}
                onClick={this.killSelectedTasksAndScale}>
              Kill &amp; Scale
            </button>
          </p>;
      }

      /* jshint trailing:false, quotmark:false, newcap:false */
      return (
        <div>
          {buttons}
          <TaskListComponent
            fetchState={this.props.fetchState}
            formatTaskHealthMessage={this.props.formatTaskHealthMessage}
            hasHealth={this.props.hasHealth}
            onTaskToggle={this.onTaskToggle}
            onTaskDetailSelect={this.props.onTaskDetailSelect}
            selectedTasks={this.state.selectedTasks}
            STATES={this.props.STATES}
            tasks={this.props.collection}
            toggleAllTasks={this.toggleAllTasks} />
        </div>
      );
    }
  });
});
