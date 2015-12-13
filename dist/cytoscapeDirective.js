angular.module('app').directive(
    'cytoscape',

    function($document, $timeout) {
        return {
            restrict: 'E',
            template: '<div id="cy"></div>',
            replace: true,
            scope: {
                elements: '=',
                styles: '=',
                layout: '=',
                selectedElements: '=',
                addElements: '=',
                deleteElements: '=',
                highlightByName: '=',
                onComplete: '=',
                onChange: '=',
                navigatorContainerId: '@'
            },
            link: function(scope, element, attributes, controller) {
                scope.$watchGroup(['elements', 'styles', 'layout'], function(
                    newValues, oldValues, scope) {
                    var safe = true;
                    for (var i in newValues)
                        if (!newValues[i]) safe = false;
                    if (safe) {
                        var elements = newValues[0];
                        var styles = newValues[1];
                        var layout = newValues[2];
                        cytoscape({
                            container: element[0],
                            elements: elements,
                            style: styles,
                            layout: layout,
                            boxSelectionEnabled: true,
                            motionBlur: false,
                            wheelSensitivity: 0.2,
                            ready: function() {
                                var cy = this;
                                // Run layout after add new elements
                                var runLayout = function(addedElements) {
                                    if (addedElements) {
                                        layout.maxSimulationTime = 10;
                                        layout.fit = false;
                                        var addLayout = addedElements.makeLayout(layout);
                                        addLayout.pon('layoutstop').then(function(event) {
                                            layout.maxSimulationTime = 2000;
                                            cy.elements().makeLayout(layout).run();
                                        });
                                        addLayout.run();
                                    }
                                };
                                // Tap
                                cy.on('tap', function(event) {
                                    $timeout(function() {
                                        scope.selectedElements = cy.$(':selected');
                                    }, 10);
                                });
                                // Mouseout
                                cy.on('mouseout', function() {
                                    cy.elements().removeClass('mouseover');
                                    cy.elements().removeClass('edge-related');
                                });
                                // Mouseover
                                cy.on('mouseover', function(event) {
                                    var target = event.cyTarget;
                                    if (target != event.cy) {
                                        target.addClass('mouseover');
                                        target.neighborhood().edges()
                                            .addClass('edge-related');
                                    }
                                });
                                // Add elements
                                scope.$watch('addElements', function(addElements) {
                                    if (addElements) {
                                        var addedElements = cy.add(addElements);
                                        runLayout(addedElements);
                                        cy.elements().unselect();
                                        scope.onChange(cy);
                                    }
                                });
                                // Delete elements
                                scope.$watch('deleteElements', function(deleteElements) {
                                    if (deleteElements) {
                                        try {
                                            cy.remove(deleteElements);
                                        } catch (exception) {
                                            for (var i in deleteElements)
                                                cy.remove(cy.$('#' + deleteElements[i].data.id));
                                        }
                                        cy.elements().unselect();
                                        scope.onChange(cy);
                                    }
                                });
                                // Filter nodes by name
                                scope.$watch('highlightByName', function(name) {
                                    cy.elements().addClass('searched');
                                    if (name && name.length > 0) {
                                        var cleanName = name.toLowerCase().trim();
                                        var doHighlight = function(i, node) {
                                            var currentName = node.data().name.toLowerCase()
                                                .trim();
                                            if (currentName.indexOf(name) > -1) node.removeClass('searched');
                                        };
                                        cy.nodes().each(doHighlight);
                                    } else {
                                        cy.elements().removeClass('searched');
                                    }
                                });
                                // Navigator
                                if (scope.navigatorContainerId) {
                                    cy.navigator({
                                        container: document.getElementById(scope.navigatorContainerId)
                                    });
                                }
                                // On complete
                                if (scope.onComplete) {
                                    scope.onComplete({
                                        graph: cy,
                                        layout: layout
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    });