/**
 * Created by BBN on 15/02/2017.
 */
(function($, bbn, kendo){
  "use strict";

  /**
   * Classic input with normalized appearance
   */
  Vue.component('bbn-popup', {
    template: "#bbn-tpl-component-popup",

    props: {
      source: {
        type: Array,
        default: function(){
          return [];
        }
      }
    },

    data: function(){
      var popups = [],
          j = 0;
      $.each(this.source, function(i, a){
        if ( a.title && (a.content || a.component) ){
          if ( a.ref === undefined ){
            a.ref = bbn.fn.randomString(15, 20).toLowerCase();
          }
          a.index = j;
          popups.push(a);
          j++;
        }
      })
      return {
        num: this.source.length,
        popups: popups
      }
    },

    methods: {
      close: function(idx){
        var vm = this;
        if ( vm.popups[idx] ){
          if ( $.isFunction(vm.popups[idx].close) ){
            (function(ele, data){
              vm.popups[idx].close();
            })(vm.popups[idx].widget.element, vm.popups[idx].data || {});
          }
          if ( vm.popups[idx].widget ){
            vm.popups[idx].widget.destroy();
          }
          vm.popups.splice(idx, 1);
          vm.source.splice(idx, 1);
        }
      },

      center: function(idx){
        var vm = this;
        if ( vm.popups[idx] && vm.popups[idx].widget ){
          vm.popups[idx].widget.center();
        }
      },

      getCfg: function(obj){
        var vm = this;
        return {
          title: obj.title ? obj.title : bbn._("Untitled"),
          draggable: obj.draggable === false ? false : true,
          modal: obj.modal === false ? false : true,
          width: obj.width ? obj.width : 300,
          height: obj.height ? obj.height : 200,
          close: function(ui){
            if ( obj.close ){
              var ele = ui.sender.element,
                  data = obj.data || {};
              obj.close(ele, data);
            }
            vm.close(obj.index);
          },
          activate: function(ui){
            if ( obj.open ){
              var ele = ui.sender.element,
                  data = obj.data || {};
              bbn.fn.log("ACTIVATE", obj, vm.$refs[obj.ref]);
              obj.open(vm.$refs[obj.ref]);
            }
          }
        };
      },

      makeWindow: function(a){
        bbn.fn.log("MK", a.ref, this.$refs);
        var vm = this,
            ele = vm.$el.children[a.index];
        a.widget = $(ele).kendoWindow(vm.getCfg(a)).data("kendoWindow");
        vm.center(a.index);
      }
    },

    computed: {
      zIndex: function(){
        return 10005 + $(this.$el).siblings(".bbn-popup").length;
      }
    },

    mounted: function(){
      var vm = this;
      $.each(vm.popups, function(i, a){
        if ( a.ref === undefined ){
          a.ref = bbn.fn.randomString(15, 20).toLowerCase();
        }
        a.index = i;
        vm.makeWindow(a);
      })
    },

    watch: {
      source: function(){
        var vm = this,
            j = 0;
        bbn.fn.log("CHANGE IN POPUPS SOURCE");
        if ( vm.source.length > this.num ){
          $.each(vm.source, function(i, a){
            if ( a.title && (a.content || a.component) ){
              if ( a.ref === undefined ){
                a.ref = bbn.fn.randomString(15, 20).toLowerCase();
              }
              a.index = j;
              vm.popups.push(a);
              vm.$nextTick(function(){
                vm.makeWindow(a);
              });
              j++;
            }
          })
        }
        else if ( vm.source.length < this.num ){

        }
        this.num = vm.source.length;
      }
    }
  });

})(jQuery, bbn, kendo);
