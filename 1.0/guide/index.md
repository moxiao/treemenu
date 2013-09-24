## 综述

treemenu是自适应多级树形菜单。

* 版本：1.0
* 作者：moxiao
* demo：[http://gallery.kissyui.com/treemenu/1.0/demo/index.html](http://gallery.kissyui.com/treemenu/1.0/demo/index.html)

## 初始化组件
    S.use('gallery/treemenu/1.0/index', function (S, Treemenu) {
         var menu = {
                       container: '#menu', //全局参数：树形菜单容器，可以传入ID或Node，必填
                       unfoldAll: false, //全局参数：初始状态是否展开所有节点，可选，默认false
                       unique: false, //全局参数：同分支下，同级仅展开一个节点，可选，默认false
                       anim: true, //全局参数：节点收缩或展开使用渐隐效果，可选，默认为true
                       selectable: true, //全局参数：叶节点可以被选中，可选，默认为true
                       name: 'treemenu', //全局参数：控件名字，是所有样式的前缀，可选，默认为treemenu
                       style: 'gray-dot', //全局参数：控件样式，是所有样式的中缀，可选，为gray-dot
                       titleRender: function(menuObj){return menuObj.title;} // 全局参数：每个节点文本的渲染方式，可选，默认显示title
                       title: '根节点', //节点参数：节点显示文本，必填
                       value: 'root', //节点参数：节点值，可选，无默认值
                       tip: '根节点tip', //节点参数：节点tip，可选，无默认值
                       unfold: false, //分支节点参数：当前分支节点初始状态是否展开，在unfoldAll=false时生效，可选，默认为false
                       selected: false, //叶支节点参数：当前叶节点初始状态是否被选中，可选，默认为false
                       subMenu: [ // 分支节点参数：当前分支节点下包含的子节点，可选，无默认值
                           {
                               title: XXX,
                               value: XXX,
                               subMenu[...]
                           },
                           {
                               title: XXX,
                               value: XXX,
                               subMenu[...]
                           },...
                       ] 
                    };


         var treemenu = new Treemenu(menu);
         treemenu.render();
    })

## API说明

### render()
    渲染整棵树，树的状态保存在传入menu对象的节点中，如果动态修改树或者操作树，请改变menu对象的属性，reload+render。

### reload(menu)
    重新渲染整棵树。通常和render连用。如果要动态修改树形，可以修改menu对象，再重新reload+render。

### unfoldAll()
    展开所有分支节点。

### foldAll()
    收缩所有分支节点。

### resetAll()
    重置树的结构为最近一次render的状态。

### 事件fold
    分支节点收缩触发，event返回entity。
        entity包含属性：title - 标题，
                    value - value值，
                    tip - tip值
                    index - 每个节点的唯一编号，
                    level - 节点坐在层级，从0开始，
                    isLeaf - 是否是叶节点，
                    unfold - 展开状态，分支节点有效，
                    selected - 选中状态，叶节点有效

### 事件unfold
    分支节点展开触发，event返回entity。

### 事件select
    叶节点被选中触发，event返回entity。

### 事件mouseover
    节点mouseover触发，event返回entity。
  
### 事件mouseout
    节点mouseover触发，event返回entity。
  