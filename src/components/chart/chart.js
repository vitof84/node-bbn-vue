/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 24/05/2017
 * Time: 15:45
 */

(function($, bbn){
  "use strict";

  /**
   * Classic input with normalized appearance
   */
  Vue.component('bbn-chart', {
    mixins: [bbn.vue.optionComponent],
    template: "#bbn-tpl-component-chart",
    props: {
      source: {},
      type: {
        type: String
      },
			title: {
        type: String
      },
      titleX: {
        type: String
      },
      titleY: {
        type: String
      },
      width: {
        type: String
      },
      height: {
        type: String
      },
      showPoint: {
        type: Boolean
      },
      showLine: {
        type: Boolean
      },
      lineSmooth: {
        type: Boolean
      },
      donut: {
        type: [Boolean, Number]
      },
      fullWidth: {
        type: Boolean
      },
      showArea: {
        type: Boolean
      },
      showLabel: {
        type: Boolean
      },
      axisX: {
        type: Object
      },
      axisY: {
        type: Object
      },
      showLabelX: {
        type: Boolean
      },
      reverseLabelX: {
        type: Boolean
      },
			odd: {
        type: Boolean
      },
      even: {
        type: Boolean
      },
      showGridX: {
        type: Boolean
      },
      showLabelY: {
        type: Boolean
      },
      reverseLabelY: {
        type: Boolean
      },
      showGridY: {
        type: Boolean
      },
      animation: {
        type: [Boolean, Number]
      },
      // set it to 0 (zero) for stacked bars
      barsDistance: {
        type: Number
      },
      horizontalBars: {
        type: Boolean
      },
      reverseData: {
        type: Boolean
      },
      color: {
        type: [String, Array]
      },
      labelColor: {
        type: String
      },
      labelColorX: {
        type: String
      },
      labelColorY: {
        type: String
      },
      backgroundColor: {
        type: String
      },
      gridColor: {
        type: String
      },
      max: {
        type: Number
      },
      min: {
        type: Number
      },
      onlyInteger: {
        type: Boolean
      },
      tooltip: {
        type: Boolean
      },
      pointLabel: {
        type: Boolean
      },
      legend: {
        type: [Boolean, Array]
      },
      /*threshold: {
        type: Number
      },*/
      step: {
        type: Boolean
      },
      dateFormat: {
        type: String
      },
      /** @todo To fix labels position (labelDirection: explode) on pie chart (responsive and not)*/
      labelOffset: {
        type: Number
      },
      labelDirection: {
        type: String
      },
      padding: {
        type: Number
      },
      paddingTop: {
        type: Number
      },
      paddingRight: {
        type: Number
      },
      paddingBottom: {
        type: Number
      },
      paddingLeft: {
        type: Number
      },
      /** @todo add this to labels */
      currency: {
        type: String
      },
      /** @todo to fix problem with animation:true */
      distributeSeries: {
        type: Boolean
      },

      /*zoom: {
        type: Boolean
      },*/
      cfg: {
        type: Object,
        default: function(){
          return {
            type: 'line',
            fullWidth: true,
            tooltip: true,
            axisX: {
              showLabel: true,
              showGrid: true,
              position: 'end'
            },
            axisY: {
              showLabel: true,
              showGrid: true,
              position: 'start'
            },
            chartPadding: {},
            plugins: []
          };
        }
      }
    },
    data: function(){
      var vm = this;
      if ( (vm.type === 'line') || (vm.type === 'bar') ){
        if ( !$.isArray(vm.source.series[0]) && (vm.distributeSeries === undefined) ){
          vm.source.series = [vm.source.series];
        }
      }
      return bbn.vue.treatData(vm);
    },
    methods: {
      pieChart: function(){
        var vm = this;
        /** @todo To fix animation problem with pie chart (donut: false) */
        // Donut
        if ( $.isNumeric(vm.widgetCfg.donut) ){
          vm.widgetCfg.donutWidth = vm.widgetCfg.donut;
          vm.widgetCfg.donut = true;
        }
        // Remove axes
        delete vm.widgetCfg.axisX;
        delete vm.widgetCfg.axisY;
        // Padding
        if ( vm.widgetCfg.padding ){
          vm.widgetCfg.chartPadding = vm.widgetCfg.padding;
          delete vm.widgetCfg.padding;
        }
        // Create widget
        vm.widget = new Chartist.Pie(vm.$el, vm.widgetCfg.source, vm.widgetCfg);
        // Animations
        vm.pieAnimation();
      },
      lineChart: function(){
        var vm = this;
        // Common configuration
        vm.lineBarCommon();
        // Line step
        if (  vm.widgetCfg.step ){
          vm.widgetCfg.lineSmooth = Chartist.Interpolation.step();
          delete vm.widgetCfg.step;
        }

        // Create widget
        vm.widget = new Chartist.Line(vm.$el, vm.widgetCfg.source, vm.widgetCfg);
        // Animations
        vm.lineAnimation();
      },
      barChart: function(){
        var vm = this;
        // Common configuration
        vm.lineBarCommon();
        // Bars distance
        if ( $.isNumeric(vm.widgetCfg.barsDistance) ){
          vm.widgetCfg.seriesBarDistance = vm.widgetCfg.barsDistance;
          delete vm.widgetCfg.barsDistance;
        }
        // Create widget
        vm.widget = new Chartist.Bar(vm.$el, vm.widgetCfg.source, vm.widgetCfg);
        // Animations
        vm.barAnimation();
      },
      lineBarCommon: function(){
        var vm = this;
        // Set background color
        if ( vm.widgetCfg.backgroundColor ){
          $(vm.$el).css('backgroundColor', vm.widgetCfg.backgroundColor);
        }

        // Axis X
        // showGridX
        if ( vm.widgetCfg.showGridX !== undefined ){
          vm.widgetCfg.axisX.showGrid = vm.widgetCfg.showGridX;
          delete vm.widgetCfg.showGridX;
        }
        // showLabelX
        if ( vm.widgetCfg.showLabelX !== undefined ){
          vm.widgetCfg.axisX.showLabel = vm.widgetCfg.showLabelX;
          delete vm.widgetCfg.showLabelX;
        }
        // reverseLabelX
        if ( vm.widgetCfg.reverseLabelX ){
          vm.widgetCfg.axisX.position = 'start';
          delete vm.widgetCfg.reverseLabelX;
        }
        // Date format
        if ( vm.widgetCfg.dateFormat ){
          vm.widgetCfg.axisX.labelInterpolationFnc = function(date, idx){
						if ( vm.widgetCfg.odd ){
							return idx % 2 > 0 ? moment(date).format(vm.widgetCfg.dateFormat) : null;	
						}
						if ( vm.widgetCfg.even ){
							return idx % 2 === 0 ? moment(date).format(vm.widgetCfg.dateFormat) : null;	
						}
            return moment(date).format(vm.widgetCfg.dateFormat);
          };
        }
				// Odd labels
				if ( vm.widgetCfg.odd && !vm.widgetCfg.even && !vm.widgetCfg.dateFormat ){
					vm.widgetCfg.axisX.labelInterpolationFnc = function(val, idx){
            return idx % 2 > 0 ? val : null;
          };
				}
				// Even labels
				if ( vm.widgetCfg.even && !vm.widgetCfg.odd && !vm.widgetCfg.dateFormat ){
					vm.widgetCfg.axisX.labelInterpolationFnc = function(val, idx){
            return idx % 2 === 0 ? val : null;
          };
				}
        // Axis Y
        // showGridY
        if ( vm.widgetCfg.showGridY !== undefined ){
          vm.widgetCfg.axisY.showGrid = vm.widgetCfg.showGridY;
          delete vm.widgetCfg.showGridY;
        }
        // showLabelY
        if ( vm.widgetCfg.showLabelY !== undefined ){
          vm.widgetCfg.axisY.showLabel = vm.widgetCfg.showLabelY;
          delete vm.widgetCfg.showLabelY;
        }
        // reverseLabelY
        if ( vm.widgetCfg.reverseLabelY ){
          vm.widgetCfg.axisY.position = 'end';
          delete vm.widgetCfg.reverseLabelY;
        }
        // max (high)
        if ( vm.widgetCfg.max !== undefined ){
          vm.widgetCfg.high = vm.widgetCfg.max;
          delete vm.widgetCfg.max;
        }
        // min (low)
        if ( vm.widgetCfg.min !== undefined ){
          vm.widgetCfg.low = -vm.widgetCfg.min;
          delete vm.widgetCfg.min;
        }
        // onlyInteger
        if ( vm.widgetCfg.onlyInteger ){
          vm.widgetCfg.axisY.onlyInteger = true;
        }

        // Padding
        if ( vm.widgetCfg.padding ){
          vm.widgetCfg.chartPadding = {
            top: vm.widgetCfg.padding,
            right: vm.widgetCfg.padding,
            bottom: vm.widgetCfg.padding,
            left: vm.widgetCfg.padding
          };
          delete vm.widgetCfg.padding;
        }
        // Top padding
        if ( vm.widgetCfg.paddingTop ){
          vm.widgetCfg.chartPadding.top = vm.widgetCfg.paddingTop;
          delete vm.widgetCfg.paddingTop;
        }
        // Right padding
        if ( vm.widgetCfg.paddingRight ){
          vm.widgetCfg.chartPadding.right = vm.widgetCfg.paddingRight;
          delete vm.widgetCfg.paddingRight;
        }
        // Bottom padding
        if ( vm.widgetCfg.paddingBottom ){
          vm.widgetCfg.chartPadding.bottom = vm.widgetCfg.paddingBottom;
          delete vm.widgetCfg.paddingBottom;
        }
        // Left padding
        if ( vm.widgetCfg.paddingLeft ){
          vm.widgetCfg.chartPadding.left = vm.widgetCfg.paddingLeft;
          delete vm.widgetCfg.paddingLeft;
        }
      },
      getColorIdx: function(c){
        return c.element._node.parentElement.className.baseVal.replace('ct-series ', '').slice(-1).charCodeAt()-97;
      },
      lineAnimation: function(){
        var vm = this;
        if ( vm.widgetCfg.animation ){
          var seq = 0,
              delays = $.isNumeric(vm.widgetCfg.animation) ? vm.widgetCfg.animation : 20,
              durations = 500;
          // Once the chart is fully created we reset the sequence
          vm.widget.on('created', function(){
            seq = 0;
          });
          // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
          vm.widget.on('draw', function(chartData){
            seq++;
            if ( (chartData.type === 'line') || (chartData.type === 'area') ){
              // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
              chartData.element.animate({
                opacity: {
                  // The delay when we like to start the animation
                  begin: seq * delays + 1000,
                  // Duration of the animation
                  dur: durations,
                  // The value where the animation should start
                  from: 0,
                  // The value where it should end
                  to: 1
                }
              });
            }
            else if ( (chartData.type === 'label') && (chartData.axis.units.pos === 'x') ){
              chartData.element.animate({
                y: {
                  begin: seq * delays,
                  dur: durations,
                  from: chartData.y + 100,
                  to: chartData.y,
                  // We can specify an easing function from Chartist.Svg.Easing
                  easing: 'easeOutQuart'
                }
              });
            }
            else if ( (chartData.type === 'label') && (chartData.axis.units.pos === 'y') ){
              chartData.element.animate({
                x: {
                  begin: seq * delays,
                  dur: durations,
                  from: chartData.x - 100,
                  to: chartData.x,
                  easing: 'easeOutQuart'
                }
              });
            }
            else if ( chartData.type === 'point' ){
              chartData.element.animate({
                x1: {
                  begin: seq * delays,
                  dur: durations,
                  from: chartData.x - 10,
                  to: chartData.x,
                  easing: 'easeOutQuart'
                },
                x2: {
                  begin: seq * delays,
                  dur: durations,
                  from: chartData.x - 10,
                  to: chartData.x,
                  easing: 'easeOutQuart'
                },
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'easeOutQuart'
                }
              });
            }
            else if ( chartData.type === 'grid' ){
              // Using chartData.axis we get x or y which we can use to construct our animation definition objects
              var pos1Animation = {
                    begin: seq * delays,
                    dur: durations,
                    from: chartData[chartData.axis.units.pos + '1'] - 30,
                    to: chartData[chartData.axis.units.pos + '1'],
                    easing: 'easeOutQuart'
                  },
                  pos2Animation = {
                    begin: seq * delays,
                    dur: durations,
                    from: chartData[chartData.axis.units.pos + '2'] - 100,
                    to: chartData[chartData.axis.units.pos + '2'],
                    easing: 'easeOutQuart'
                  },
                  animations = {};
              animations[chartData.axis.units.pos + '1'] = pos1Animation;
              animations[chartData.axis.units.pos + '2'] = pos2Animation;
              animations['opacity'] = {
                begin: seq * delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: 'easeOutQuart'
              };
              chartData.element.animate(animations);
            }
          });
        }
      },
      barAnimation: function(){
        var vm = this;
        if ( vm.widgetCfg.animation ){
          var delays = $.isNumeric(vm.widgetCfg.animation) ? vm.widgetCfg.animation : 500,
              durations = 500;
          vm.widget.on('draw', function(chartData){
            if ( chartData.type === 'bar' ){
              chartData.element.attr({
                style: 'stroke-width: 0px'
              });
              for ( var s = 0; s < chartData.series.length; ++s) {
                if ( chartData.seriesIndex === s ){
                  var ax = {
                    y2: {
                      begin:  s * delays,
                      dur:    durations,
                      from:   chartData.y1,
                      to:     chartData.y2,
                      easing: Chartist.Svg.Easing.easeOutSine
                    },
                    'stroke-width': {
                      begin: s * 500,
                      dur:   1,
                      from:  0,
                      to:    10,
                      fill:  'freeze'
                    }
                  };
                  if ( vm.widgetCfg.horizontalBars ){
                    ax.x2 = ax.y2;
                    ax.x2.from = chartData.x1;
                    ax.x2.to = chartData.x2;
                    delete ax.y2;
                  }
                  chartData.element.animate(ax, false);
                }
              }
            }
            else if ( (chartData.type === 'label') && (chartData.axis.units.pos === 'x') ){
              chartData.element.animate({
                y: {
                  begin: delays,
                  dur: durations,
                  from: chartData.y + 100,
                  to: chartData.y,
                  // We can specify an easing function from Chartist.Svg.Easing
                  easing: 'easeOutQuart'
                }
              });
            }
            else if ( (chartData.type === 'label') && (chartData.axis.units.pos === 'y') ){
              chartData.element.animate({
                x: {
                  begin: delays,
                  dur: durations,
                  from: chartData.x - 100,
                  to: chartData.x,
                  easing: 'easeOutQuart'
                }
              });
            }
            else if ( chartData.type === 'grid' ){
              // Using chartData.axis we get x or y which we can use to construct our animation definition objects
              var pos1Animation = {
                    begin: delays,
                    dur: durations,
                    from: chartData[chartData.axis.units.pos + '1'] - 30,
                    to: chartData[chartData.axis.units.pos + '1'],
                    easing: 'easeOutQuart'
                  },
                  pos2Animation = {
                    begin: delays,
                    dur: durations,
                    from: chartData[chartData.axis.units.pos + '2'] - 100,
                    to: chartData[chartData.axis.units.pos + '2'],
                    easing: 'easeOutQuart'
                  },
                  animations = {};
              animations[chartData.axis.units.pos + '1'] = pos1Animation;
              animations[chartData.axis.units.pos + '2'] = pos2Animation;
              animations['opacity'] = {
                begin: delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: 'easeOutQuart'
              };
              chartData.element.animate(animations);
            }
          });
        }
      },
      pieAnimation: function(){
        var vm = this;
        if ( vm.widgetCfg.animation ){
          vm.widget.on('draw', function(chartData){
            if ( chartData.type === 'slice' ){
              // Get the total path length in order to use for dash array animation
              var pathLength = chartData.element._node.getTotalLength();
              // Set a dasharray that matches the path length as prerequisite to animate dashoffset
              chartData.element.attr({
                'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
              });
              // Create animation definition while also assigning an ID to the animation for later sync usage
              var animationDefinition = {
                'stroke-dashoffset': {
                  id: 'anim' + chartData.index,
                  dur: vm.widgetCfg.animation && $.isNumeric(vm.widgetCfg.animation) ? vm.widgetCfg.animation : 500,
                  from: -pathLength + 'px',
                  to: '0px',
                  easing: Chartist.Svg.Easing.easeOutQuint,
                  // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
                  fill: 'freeze'
                }
              };
              // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
              if ( chartData.index !== 0 ){
                animationDefinition['stroke-dashoffset'].begin = 'anim' + (chartData.index - 1) + '.end';
              }
              // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
              chartData.element.attr({
                'stroke-dashoffset': -pathLength + 'px'
              });
              // We can't use guided mode as the animations need to rely on setting begin manually
              // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
              chartData.element.animate(animationDefinition, false);
            }
          });
        }
      },
      setColor: function(){
        var vm = this;
        if ( typeof vm.widgetCfg.color === 'string' ){
          vm.widgetCfg.color = [vm.widgetCfg.color];
        }
        vm.widget.on('draw', function(chartData, b){
          /** @todo To fix error on bar with animation */
          if ( (chartData.type === 'line') ||
            (chartData.type === 'point') ||
            (chartData.type === 'bar') ||
            ( chartData.type === 'area' )
          ){
            var color = vm.widgetCfg.color[vm.widgetCfg.legend ? vm.getColorIdx(chartData) : chartData.seriesIndex];
            if ( color ){
              chartData.element.attr({
                style: ( chartData.type === 'area' ? 'fill: ' : 'stroke: ') + color + ( chartData.type === 'area' ? '; fill-opacity: 0.1; stroke: none' : '')
              });
            }
          }
          if ( chartData.type === 'slice' ){
            var color = vm.widgetCfg.color[vm.widgetCfg.legend ? vm.getColorIdx(chartData) : chartData.index];
            if ( color ){
              chartData.element.attr({
                style: (vm.widgetCfg.donut ? 'stroke: ' : 'fill: ') + color
              });
            }
          }
        });
      },
      setLabelColor: function(){
        var vm = this;
        vm.widget.on('draw', function(chartData){
          var color = '';
          if ( (chartData.type === 'label') ){
            if ( vm.widgetCfg.labelColor ){
              color = vm.widgetCfg.labelColor;
            }
            if ( vm.widgetCfg.type !== 'pie' ){
              if ( vm.widgetCfg.labelColorX && (chartData.axis.units.pos === 'x') ){
                color = vm.widgetCfg.labelColorX;
              }
              else if ( vm.widgetCfg.labelColorY && (chartData.axis.units.pos === 'y') ){
                color = vm.widgetCfg.labelColorY;
              }
              $(chartData.element._node.children[0]).css('color', color);
            }
            else {
              chartData.element.attr({
                style: 'fill: ' + color
              });
            }
          }
        });
      },
      setGridColor: function(){
        var vm = this;
        vm.widget.on('draw', function(chartData){
          if ( chartData.type === 'grid' ){
            chartData.element.attr({
              style: 'stroke: ' + vm.widgetCfg.gridColor
            });
          }
        });
      },
      /*trasformData: function(){
        var vm = this;
        $.each(vm.widgetCfg.source.series, function(i, v){
          vm.widgetCfg.source.series[i] = $.map(v, function(el, idx){
            if ( (typeof el !== 'object') && vm.widgetCfg.source.labels[idx] ){
              return {
                x: vm.widgetCfg.source.labels[idx],
                y: el
              };
            }
            return el;
          })
        });
        vm.widgetCfg.source.labels = [];
      },
      getLabelsLength : function(){
        var vm = this,
            length = 0;
        $.each(vm.widgetCfg.source.series, function(i,v){
          length = v.length > length ? v.length : length;
        });
        return length;
      },*/
      addPlugins: function(){
        var vm = this;

        // tooltip
        if ( vm.widgetCfg.tooltip ){
          vm.widgetCfg.plugins.push(Chartist.plugins.tooltip({
            currency: vm.widgetCfg.currency || false
          }));
          delete vm.widgetCfg.tooltip;
        }

        // axis X/Y title
        if ( vm.widgetCfg.titleX || vm.widgetCfg.titleY ){
          vm.widgetCfg.plugins.push(
            Chartist.plugins.ctAxisTitle({
              axisX: {
                axisTitle: vm.widgetCfg.titleX || '',
                axisClass: 'ct-axis-title',
                offset: {
                  x: 0,
                  y: 30
                },
                textAnchor: 'middle'
              },
              axisY: {
                axisTitle: vm.widgetCfg.titleY || '',
                axisClass: 'ct-axis-title',
                offset: {
                  x: 0,
                  y: 0
                },
                textAnchor: 'middle',
                flipTitle: false
              }
            })
          );
        }

        // Point Label
        if ( vm.widgetCfg.pointLabel ){
          vm.widgetCfg.plugins.push(Chartist.plugins.ctPointLabels());
        }

        // Legend
        if ( vm.widgetCfg.legend ){
          vm.widgetCfg.plugins.push(Chartist.plugins.legend({
            onClick: function(a,b){
              var $rect = $("div.rect", b.target);
              if ( $rect.hasClass('inactive') ){
                $rect.removeClass('inactive');
              }
              else {
                $rect.addClass('inactive');
              }
            },
            removeAll: true,
            legendNames: $.isArray(vm.widgetCfg.legend) ? vm.widgetCfg.legend : false
          }));
        }

        // Thresold
        /** @todo  it's not compatible with our colors system and legend */
        /*if ( (vm.isLine || vm.isBar) && $.isNumeric(vm.widgetCfg.threshold) ){
          vm.widgetCfg.plugins.push(Chartist.plugins.ctThreshold({
            threshold: vm.widgetCfg.threshold
          }));
        }*/

        // Zoom
        /** @todo problems with scale x axis */
        /*if ( vm.widgetCfg.zoom && vm.isLine ){
          vm.trasformData();
          vm.widgetCfg.axisX.type =  Chartist.AutoScaleAxis;
          vm.widgetCfg.axisX.divisor = vm.getLabelsLength();
          vm.widgetCfg.axisY.type =  Chartist.AutoScaleAxis;
          vm.widgetCfg.plugins.push(
            Chartist.plugins.zoom({
              onZoom : function(chart, reset) {
                vm.resetZoom = reset;
              }
            })
          );
        }*/
      },
      widgetDraw: function(){
        var vm = this,
            externaLabel = vm.widget.options.labelDirection === 'explode',
            yOffset = externaLabel ? 15 : 7.5,
            p = 1,
            idDef = bbn.fn.randomString(),
            defs = false;
        vm.widget.on('draw', function(chartData){
          var tmp = 1;
          // Insert linebreak to labels
          if ( vm.isPie ){
            if ( chartData.type === 'label' ){
              var lb = chartData.text.split("\n"),
                  text = '';
              if ( lb.length ){
                text = '<tspan>' + lb[0] + '</tspan>';
                $.each(lb, function(i, v){
                  if ( i > 0 ){
                    text += '<tspan dy="' + yOffset + '" x="' + chartData.x + '">' + v + '</tspan>';
                    chartData.y -= yOffset;
                    chartData.element._node.attributes.dy.value -= yOffset;
                  }
                });
              }
              chartData.element._node.innerHTML = text;
              tmp = lb.length > p ? lb.length : tmp;
            }
            if ( externaLabel && ( tmp > p) ){
              p = tmp;
              //vm.widget.update(vm.widget.data, {chartPadding: (vm.widget.options.chartPadding ? vm.widget.options.chartPadding : 0) + (p*yOffset)}, true);
            }
            if ( chartData.type === 'slice' ){
              if ( !defs ){
                defs = {
                  x: chartData.center.x,
                  y: chartData.center.y
                };
                $(chartData.group._node.parentNode).prepend('<defs><radialGradient id="' + idDef + '" r="122.5" gradientUnits="userSpaceOnUse" cx="' + defs.x + '" cy="' + defs.y + '"><stop offset="0.05" style="stop-color:#fff;stop-opacity:0.65;"></stop><stop offset="0.55" style="stop-color:#fff;stop-opacity: 0;"></stop><stop offset="0.85" style="stop-color:#fff;stop-opacity: 0.25;"></stop></radialGradient></defs>');
              }
              chartData.element._node.outerHTML += '<path d="' + chartData.element._node.attributes.d.nodeValue + '" stroke="none" fill="url(#' + idDef + ')"></path>';
            }
          }
        });
      },
      widgetCreated: function(){
        var vm = this;
        vm.widget.on('created', function(chartData){



          // Set the right colors to legend
          if ( vm.widgetCfg.legend ){
            var colors = [];
            $("g.ct-series", vm.widget.container).each(function(i,v){
              if ( vm.isBar ){
                colors.push($("line.ct-bar", v).first().css('stroke'));
              }
              else {
                $("path", v).each(function(k,p){
                  if ( $(p).hasClass('ct-line') ||
                    $(p).hasClass('ct-slice-pie') ||
                    $(p).hasClass('ct-slice-donut')
                  ){
                    colors.push($(p).css($(p).hasClass('ct-slice-pie') ? 'fill' : 'stroke'));
                  }
                })
              }
            });
            setTimeout(function(){
              $("ul.ct-legend li", vm.widget.container).each(function(i,v){
                if ( !$("div.rect", v).length ){
                  $(v).prepend('<div class="rect" style="background-color: ' + colors[i] +'; border-color: ' + colors[i] + '"></div>');
                }
              });
            }, 100);
          }
          // Set the right colors to point labels
          if ( (vm.widgetCfg.type !== 'pie') && (vm.widgetCfg.labelColor || vm.widgetCfg.labelColorY) ){
            $("g.ct-series text.ct-label", vm.widget.container).css('stroke', vm.widgetCfg.labelColorY || vm.widgetCfg.labelColor);
          }
          // Reset zoom
          /*if ( vm.widgetCfg.zoom && vm.isLine ){
            $(vm.widget.container).dblclick(function(){
              if ( vm.resetZoom && $.isFunction(vm.resetZoom) ){
                vm.resetZoom();
              }
            });
          }*/
        });
      }
    },
    mounted: function(){
      var vm = this;
      if ( vm.widget ){
        vm.widget.destroy();
        vm.widget = false;
      }

      vm.isLine = vm.widgetCfg.type === 'line';
      vm.isBar = vm.widgetCfg.type === 'bar';
      vm.isPie = vm.widgetCfg.type === 'pie';

      // Set width
      if ( vm.widgetCfg.width && (typeof vm.widgetCfg.width === 'string') ){
        $(vm.$el).width(vm.widgetCfg.width);
        vm.widgetCfg.width = '100%';
      }

      // Add Plugins
      vm.addPlugins();

      // Widget configuration
      switch ( vm.widgetCfg.type ){
        // Pie type
        case 'pie':
          vm.pieChart();
          break;
        // Line type
        case 'line':
          vm.lineChart();
          break;
          // Bar type
        case 'bar':
          vm.barChart();
          break;
      }

      // Set items color
      if ( vm.widgetCfg.color ){
        vm.setColor();
      }
      // Set labels color
      if ( vm.widgetCfg.labelColor || vm.widgetCfg.labelColorX || vm.widgetCfg.labelColorY ){
        vm.setLabelColor();
      }
      // Set grid color
      if ( vm.widgetCfg.gridColor ){
        vm.setGridColor();
      }

      // Operations to be performed during the widget draw
      vm.widgetDraw();
      // Operations to be performed after widget creation
      vm.widgetCreated();
    }
  });

})(jQuery, bbn);