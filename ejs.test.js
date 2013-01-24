define('ejs.test', require.isBrowser ? ['ejs', 'test', 'jslint', 'jquery'] : ['ejs', 'test', 'jslint'], function(EJS, test, jslint, $){
  var echo = $ ? function(t, e, m){
    $('body').append('<p>Test <strong>'+t+'</strong> '+(e ? 'FAIL' : 'PASS')+'</p>'+(m ? '<textarea>'+m+'</textarea>' : ''));
  } : function(t, e, m){
    console.log('Test "'+t+'" '+(e ? 'FAIL' : 'PASS')+'');
    if(m){
      console.log(m);
    }
  }, pret = function(s){
    return s
      .replace(/\n/gm, '\\n\n')
      .replace(/\t/g, '\\t')
      .replace(/\ /g, '\\s');
  }, cker = function(data, error){
    for(var i in data){
      if(error[i] != data[i]){
	return false;
      }
    }
    return true;
  };
  
  if(typeof JSLINT == 'function'){
    EJS.prototype.check = function(r){
      var v = JSLINT, m = [],
      c = r.slice(1, r.length - 1).join('\n');
      v(c, {
	white:true,
	sloppy:true,
	nomen:true,
	undef:true,
	forin:true,
	plusplus:true,
	vars:true
      });
      for(var i = 0; i < v.errors.length; i++){
	var e = v.errors[i];
	if(e && e.reason != 'Use a named parameter.'
	   && e.reason != 'Bad assignment.'){
	  m.push('Line '+e.line+': '+e.reason);
	}
      }
      return new Error(m.join('\n'));
    };
  }
  
  var r = new EJS();
  
  for(var name in test){
    (function(name, test){
      require(test.type == 'equal' ? ['text!test/'+name+'.tmpl', 'text!test/'+name+'.html'] : ['text!test/'+name+'.tmpl'], function(tmpl, html){
	var e, m, c = r.compile(tmpl);
	c = r.render(test.data || {});
	if(c instanceof Error){
	  if(test.type == 'equal' || (test.type == 'error' && !cker(test.error, c))){
	    e = true;
	  }
	  m = ''+c;
	}else if(test.type == 'equal' && c != html){
	  e = true;
	  m = 'Expected: "'+pret(html)+'" Produced: "'+pret(c)+'"';
	}
	echo(name, e, m);
      });
    })(name, test[name]);
  }
});
