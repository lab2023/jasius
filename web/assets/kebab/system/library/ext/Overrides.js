/**
 * ExtJS Window Override
 * Window animation settings
 */
Ext.override(Ext.Window, {
    defaultAnimShowCfg: {
        duration: .25,
        easing: 'easeNone',
        opacity: .5
    },
    defaultAnimHideCfg: {
        duration: .25,
        easing: 'easeNone',
        opacity: 0
    },
    animShow : function(){
        this.proxy.show();
        this.proxy.setBox(this.animateTarget.getBox());
        this.proxy.setOpacity(0);
        var b = this.getBox(false);
        b.callback = this.afterShow;
        b.scope = this;
        b.block = true;
        Ext.apply(b, this.animShowCfg, this.defaultAnimShowCfg);
        this.el.setStyle('display', 'none');
        this.proxy.shift(b);
    },
    animHide : function(){
        this.proxy.setOpacity(.5);
        this.proxy.show();
        var tb = this.getBox(false);
        this.proxy.setBox(tb);
        this.el.hide();
        var b = this.animateTarget.getBox();
        b.callback = this.afterHide;
        b.scope = this;
        b.block = true;
        Ext.apply(b, this.animHideCfg, this.defaultAnimHideCfg);
        this.proxy.shift(b);
    }
});

/**
 * Tree Node UI setIcon
 */
Ext.override(Ext.tree.TreeNodeUI, {
    setIconCls : function(iconCls) {
        if(this.iconNode){
            Ext.fly(this.iconNode).replaceClass(this.node.attributes.iconCls, iconCls);
        }
        this.node.attributes.iconCls = iconCls;
    },
    setIcon : function(icon) {
        if(this.iconNode){
            this.iconNode.src = icon || this.emptyIcon;
            Ext.fly(this.iconNode)[icon ? 'addClass' : 'removeClass']('x-tree-node-inline-icon');
        }
        this.node.attributes.icon = icon;
    }
});

/**
 * Adding/removing fields and columns
 * @link http://www.sencha.com/forum/showthread.php?53009-Adding-removing-fields-and-columns
 */

Ext.override(Ext.data.Store,{
	addField: function(field){
		field = new Ext.data.Field(field);
		this.recordType.prototype.fields.replace(field);
		if(typeof field.defaultValue != 'undefined'){
			this.each(function(r){
				if(typeof r.data[field.name] == 'undefined'){
					r.data[field.name] = field.defaultValue;
				}
			});
		}
	},
	removeField: function(name){
		this.recordType.prototype.fields.removeKey(name);
		this.each(function(r){
			delete r.data[name];
			if(r.modified){
				delete r.modified[name];
			}
		});
	}
});
Ext.override(Ext.grid.ColumnModel,{
	addColumn: function(column, colIndex){
		if(typeof column == 'string'){
			column = {header: column, dataIndex: column};
		}
		var config = this.config;
		this.config = [];
		if(typeof colIndex == 'number'){
			config.splice(colIndex, 0, column);
		}else{
			colIndex = config.push(column);
		}
		this.setConfig(config);
		return colIndex;
	},
	removeColumn: function(colIndex){
		var config = this.config;
		this.config = [config[colIndex]];
		config.splice(colIndex, 1);
		this.setConfig(config);
	}
});
Ext.override(Ext.grid.GridPanel,{
	addColumn: function(field, column, colIndex){
		if(!column){
			if(field.dataIndex){
				column = field;
				field = field.dataIndex;
			} else{
				column = field.name || field;
			}
		}
		this.store.addField(field);
		return this.colModel.addColumn(column, colIndex);
	},
	removeColumn: function(name, colIndex){
		this.store.removeField(name);
		if(typeof colIndex != 'number'){
			colIndex = this.colModel.findColumnIndex(name);
		}
		if(colIndex >= 0){
			this.colModel.removeColumn(colIndex);
		}
	}
});