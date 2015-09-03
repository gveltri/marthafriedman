
for (i = 0; i < sculptures.length; i++) {
    if (selected_thing == sculpture[i].modules[sculpture[i].modules.length-1]) {
	sculpture[i].modules.pop();
	// only makes next olive moveable if it exists
	if (sculpture[i].modules.length !== 0)
	    moveable_objects.push(sculpture[i].modules[sculpture[i].modules.length-1]);
	break;
    }

}
