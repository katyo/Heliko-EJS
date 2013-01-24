define('ejs', function(){
  var EJS = function(src){
    if(typeof src == 'string'){
      this.compile(src);
    }
  };

  EJS.prototype = {
    regexp: /(?:\n\s*)?(<%[=]?)((?:[^%]|[%][^>])+)%>/gm,
    helper: {},
    cached: {},
    render: function(data){
      if(this.method instanceof Function){
	try{
	  return this.method('', this.parsed, this.helper, data);
	}catch(e){
	  this.error = new EJS.RenderError(e.message);
	}
      }
      return this.error;
    },
    compile: function(src){
      delete this.method;
      delete this.error;
      var p = src.split(this.regexp), r = [], i, o;
      this.parsed = p;
      for(i = 0; i < p.length; i++){
	if(p[i] == '<%'){
	  o = p[++i];
	}else{
	  if(p[i] == '<%='){
	    o = p[++i];
	  }else{
	    o = 'arguments[1][' + i + ']';
	  }
	  o = 'arguments[0]+=' + o + ';';
	}
	r.push(o);
      }
      r.unshift('with(arguments[2]){'+
		'with(arguments[3]){');
      r.push('};};return arguments[0];');
      try{
	this.method = new Function(r.join('\n'));
	return true;
      }catch(e){
	if(typeof this.check == 'function'){
	  e = this.check(r);
	}
	this.error = new EJS.CompileError(e.message);
	return this.error;
      }
    }
  };

  EJS.CompileError = function(message){
    if(typeof message == 'string'){
      this.message = message;
    }
  };
  EJS.CompileError.prototype = new Error();
  EJS.CompileError.prototype.name = 'EJS.CompileError';

  EJS.RenderError = function(message){
    if(typeof message == 'string'){
      this.message = message;
    }
  };
  EJS.RenderError.prototype = new Error();
  EJS.RenderError.prototype.name = 'EJS.RenderError';

  EJS.Helper = function(name, func){
    if(arguments.length < 2){
      return EJS.prototype.helper[name];
    }
    if(func === null){
      delete EJS.prototype.helper[name];
      return;
    }
    if(typeof func == 'function'){
      EJS.prototype.helper[name] = func;
      return true;
    }
  };

  EJS.Helper('img_tag', function(src, alt){
    return src ? '<img src="' + src + '"' +
      (alt ? ' alt="' + alt + '"' : '') + '/>' : '';
  });
  EJS.Helper('link_to', function(title, href){
    return title && href ?
      '<a href="' + href + '">' + title + '</a>' : '';
  });

  return EJS;
});
