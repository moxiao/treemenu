/**
 * @fileoverview 
 * @author moxiao<moxiao.hd@taobao.com>
 * @module treemenu
 **/
KISSY.add(function (S, Node, Base, Event, Anim) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class Treemenu
     * @constructor
     * @extends Base
     */
    function Treemenu(comConfig) {
        var self = this;
        //调用父类构造函数
        Treemenu.superclass.constructor.call(self, comConfig);
		self.cfg = comConfig;
    }

    S.extend(Treemenu, Base, {
		_init : function(){
			var self = this;
			
			self.cfgCopy = S.clone(self.cfg);
			self.cfg = S.merge({
				container: '#menu',
				unfold: false,
				unfoldAll: false,
				unique: false,
				anim: true,
				selectable: true,
				name: 'treemenu',
				style: 'gray-dot',
				titleRender: function(menuObj){return menuObj.title;}
			}, self.cfg);
		
			self.container = S.isString(self.cfg.container) ? Node.one(self.cfg.container) : self.cfg.container;
			self._renderAndBindEvt();
		},
		
		_renderAndBindEvt : function(){
			var self = this;
			
			self.allMenuObj = [];
			self.maxLevel = 0;
			
			if(self.container){
				self.container.html(self._renderMenu(self.cfg, 0));
				Node.all('dt', self.container).delegate('click mouseover mouseout', 'q', function(evt){
					var target = Node.one(this);
					var dlNode = target.parent('dl');
					var idx = Number(target.attr('idx'));
					var qNode = Node.one(evt.currentTarget);
					
					if(evt.type == 'click'){
						if(self.allMenuObj[idx].unfold){
							// 收缩节点操作
							self._foldNode(dlNode);
							self.allMenuObj[idx].unfold = false;
							self.fire('fold', {entity : self.allMenuObj[idx]});
						}else{
							// 展开节点操作
							self._unfoldNode(dlNode);
							self.allMenuObj[idx].unfold = true;
							self.fire('unfold', {entity : self.allMenuObj[idx]});
							
							if(self.cfg.unique && target.parent('dd')){
								target.parent('dd').siblings('dd').each(function(sibling){
									var siblingIdx = Number(sibling.attr('idx'));
									var siblingMenuObj = self.allMenuObj[siblingIdx];
									if(!siblingMenuObj.isLeaf && siblingMenuObj.unfold){
										self._foldNode(sibling.one('dl'), false);
										siblingMenuObj.unfold = false;
										self.fire('unfold', {entity : siblingMenuObj});
									}
								});
							}
						}
					}else if(evt.type == 'mouseover'){
						qNode.addClass(self._getStyle('mouseover-node'));
						self.fire('mouseover', {entity : self.allMenuObj[idx]});
					}else{
						qNode.removeClass(self._getStyle('mouseover-node'));
						self.fire('mouseout', {entity : self.allMenuObj[idx]});
					}
				});
				
				Node.all('dd.'+self._getStyle('leaf'), self.container).delegate('click mouseover mouseout', 'q', function(evt){
					var target = Node.one(evt.currentTarget);
					var idx = Number(Node.one(this).attr('idx'));
					var menuObj = self.allMenuObj[idx];
					
					if(evt.type == 'click'){
						if(self.cfg.selectable){
							if(self.cfg.lastSelectedLeaf){
								self.cfg.lastSelectedLeaf.obj.selected = false;
								self.cfg.lastSelectedLeaf.node.removeClass(self._getStyle('selected'));
							}
							self.cfg.lastSelectedLeaf = {node: target, obj: menuObj};
							target.addClass(self._getStyle('selected'));
							target.removeClass(self._getStyle('mouseover-leaf'));
						}
						
						menuObj.selected = true;
						self.fire('select', {entity : menuObj});
					}else if(evt.type == 'mouseover'){
						if(!menuObj.selected){
							target.addClass(self._getStyle('mouseover-leaf'));
						}
						self.fire('mouseover', {entity : menuObj});
					}else{
						target.removeClass(self._getStyle('mouseover-leaf'));
						self.fire('mouseout', {entity : menuObj});
					}
				});
				
				var selectedNode = Node.one('q.'+self._getStyle('selected'));
				var selectedMenuObj = null;
				if(selectedNode){
					selectedMenuObj = self.allMenuObj[Number(selectedNode.parent('dd').attr('idx'))];
					self.cfg.lastSelectedLeaf = {node: selectedNode, obj: selectedMenuObj};
				}
			}
		},
		
		_unfoldNode: function(dlNode, anim){
			anim = anim == null ? true : anim;
			var title = dlNode.children('dt');
			var submenu = dlNode.children('dd');
			title.replaceClass(this._getStyle('fold'), this._getStyle('unfold'));
			anim && this.cfg.anim ? submenu.fadeIn(0.32) : submenu.show();
		},
		
		_foldNode:function(dlNode, anim){
			anim = anim == null ? true : anim;
			var title = dlNode.children('dt');
			var submenu = dlNode.children('dd');
			title.replaceClass(this._getStyle('unfold'), this._getStyle('fold'));
			anim && this.cfg.anim ? submenu.fadeOut(0.16) : submenu.hide();
		},
		
		_renderMenu : function(menuObj, level){
			menuObj.level = level;
			menuObj.index = this.allMenuObj.length;
			menuObj.isLeaf = typeof menuObj.subMenu == 'undefined';
			menuObj.unfold = typeof menuObj.unfold == 'undefined' ? false : menuObj.unfold;
			
			var html = [];
			var i  = 0, currIdx = this.allMenuObj.length;
			var show = this.cfg.unfoldAll || menuObj.unfold ? '' : 'style="display:none"';
			var fold = this.cfg.unfoldAll || menuObj.unfold ? this._getStyle('unfold') : this._getStyle('fold');
			var menu = this._getStyle(level==0?'menu':'submenu');
			var selected = menuObj.selected ? this._getStyle('selected') : '';
			var quto = this._getStyle('quto');
			var tip = menuObj.tip && menuObj.tip.length > 0 ? 'title="' + menuObj.tip + '"' : '';
			var last = null;
			var leaf = null;
			
			this.maxLevel = Math.max(this.maxLevel, level);
			this.allMenuObj.push(menuObj);
			
			if(menuObj.subMenu){
				html.push('<dl class="'+menu+'">');
				html.push('<dt class="'+fold+'" idx="'+currIdx+'"><q '+this._getClass(quto)+' '+tip+'>' + this.cfg.titleRender(menuObj) + '</q></dt>');
				for(i = 0; i < menuObj.subMenu.length; i++){
					last = i != menuObj.subMenu.length - 1 ? '' : this._getStyle('last');
					leaf = menuObj.subMenu[i].subMenu ? '' : this._getStyle('leaf');
					html.push('<dd '+this._getClass(last, leaf)+' '+show+' idx="'+this.allMenuObj.length+'">');
					html.push('<p class="'+this._getStyle('cross')+'"></p>');
					html.push(this._renderMenu(menuObj.subMenu[i], level + 1));
					html.push('</dd>');
				}
				html.push('</dl>');
			}else{
				html.push('<q '+this._getClass(quto, selected)+' '+tip+'>' + this.cfg.titleRender(menuObj) + '</q>');
			}
			return html.join('');
		},
		
		_getStyle : function(style){
			return this.cfg.name + '-' + this.cfg.style + '-' + style;
		},
		
		_getClass : function(){
			if(arguments.length == 0){
				return '';
			}else{
				var classes = [];
				var i = 0;
				for(i = 0; i < arguments.length; i++){
					if(arguments[i] != null && arguments[i].length > 0){
						classes.push(arguments[i]);
					}
				}
				
				return 'class="' + classes.join(' ') + '"';
			}
		},
		
		render: function(){
			this._init();
		},
		
		unfoldAll: function(){
			var self = this;
			self.cfg.unfoldAll = true;
			S.each(self.allMenuObj, function(menuObj){
				if(!menuObj.isLeaf && !menuObj.unfold){
					menuObj.unfold = true;
					self.fire('unfold', {entity : menuObj});
				}
			});
			
			self._renderAndBindEvt();
		},
		
		foldAll: function(){
			var self = this;
			self.cfg.unfoldAll = false;
			S.each(self.allMenuObj, function(menuObj){
				if(!menuObj.isLeaf && menuObj.unfold){
					menuObj.unfold = false;
					self.fire('fold', {entity : menuObj});
				}
			});
			self._renderAndBindEvt();
		},
		
		resetAll: function(){
			this.cfg = this.cfgCopy;
			this._init();
		},
		
		reload: function(cfg){
			this.cfg = cfg;
		}
	});

    return Treemenu;
}, {requires:['node', 'base', 'event', 'anim', './index.css']});



