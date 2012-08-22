(function ($) {
	$.fn.onlyBeOne = function (options) {
		//get the tag off the element
		var tag = this.get(0).tagName.toLowerCase();
		var listClassName = this.attr("class");
		var tagWithClass = tag + '.' + listClassName;
		//reset the dropdowns to the first entry, which is a blank
		$(tagWithClass).prop('selectedIndex', 0);
		//count the number of dropdownlist
		var countSelects = this.length;
		//determine the length of the select list 
		var allEntriesLength = $(tagWithClass).first().find('option').length;
		//indexing the original text and values from all the select lists                    
		var onListNumber;
		var listValues = [];
		var listText = [];
		var listsInformation = [];
		var indexOption = [];
		var indexCountEntries = [];
		//creating an index for counts of entries
		for (var i = 0; i < allEntriesLength; i++) {
			indexCountEntries.push(i);
		}
		for (var i = 0; i < countSelects * allEntriesLength; i++) {
			var optionEntry = $(tagWithClass + ' option:eq(' + i + ')');
			var listItemVal = "";
			//determine if the value attribute is present on entries                                                    
			if (!$(tagWithClass + ' option:eq(' + i + ')').is('[value]')) {
				listItemVal = "";
			} else {
				listItemVal = optionEntry.val();
			}
			var listItemText = optionEntry.text();
			listValues.push(listItemVal);
			listText.push(listItemText);
			//using the remainder to determine when to prepare for new set
			if (i % allEntriesLength == allEntriesLength - 1 && i != 0) {
				//final push of entries; prepare for new set into array
				var arrayForList = [];
				//giving the indexlist a position
				var indexList = (i + 1) / allEntriesLength;
				arrayForList.push(indexList);
				arrayForList.push(listText);
				arrayForList.push(listValues);
				listsInformation.push(arrayForList);
				//clearing out the intermediary arrays
				listValues = [];
				listText = [];
			}
		}
		//add index for count of entries to listInformation for referencing
		for (var i = 0; i < listsInformation.length; i++) {
			listsInformation[i].splice(1, 0, indexCountEntries);
		}
		function determineListPosition(textOfSelectedOptionFocusedList) {
			var listPosition = 0;
			for (var i = 0; i < $(tagWithClass).length; i++) {
				var textOfSelectedIterated = $.trim($(tagWithClass).eq(i).find('option:selected').text());
				if (textOfSelectedIterated === textOfSelectedOptionFocusedList) {
					listPosition = i + 1;
				}
			}
			return listPosition;
		}
		function determineEntryIndexPosition(textOfSelectedOptionFocusedList, positionOfList) {
			for (var i = 0; i < listsInformation.length; i++) {
				for (var j = 0; j < listsInformation[i][2].length; j++) {
					if (textOfSelectedOptionFocusedList == listsInformation[i][2][j] && positionOfList == listsInformation[i][0]) {
						var indexofSelectedEntry = listsInformation[i][3][j];
					}
				}
			}
			return indexofSelectedEntry;
		}
		function removeOptionsFromSiblings(sibling, textOfSelectedOptionFocusedList) {
			var optionsOfCurrentSibling = sibling.find('option');
			//finding a match in sibling and deleting it 
			optionsOfCurrentSibling.each(function () {
				var currentEntryText = $.trim($(this).text());
				if (textOfSelectedOptionFocusedList == currentEntryText) {
					$(this).remove();
				}
			})
		}
		//appending the entry into siblings
		function addOptionsForSiblings(previouslySelected, positionOfList) {
			//determine the siblings list position                   
			for (var i = 1; i < countSelects + 1; i++) {
				//only going for the siblings
				if (positionOfList !== i) {
					//getting a select list; eq() uses a zero index, have to subtract                                    
					$(tagWithClass).eq(i - 1).each(function () {
						//sibling list; contains options
						$siblingList = $(this);
						var $siblingsOptions = $(this).find('option');
						//number index of the previously selected text
						var positionOfPreviousText = listsInformation[i - 1][2].indexOf(previouslySelected);
						var siblingIndexArray = [];
						var entryCounter = -1;
						//get all index from entries of sibling
						$siblingsOptions.each(function () {
							entryCounter += 1;
							//use text to get the index
							var siblingEntryText = $.trim($(this).text());
							var siblingEntryIndex = listsInformation[i - 1][2].indexOf(siblingEntryText);
							function determineValue(siblingValueRestoreEntry) {
								if (siblingValueRestoreEntry == "") {
									var appendPrefix = '<option>';
								} else {
									appendPrefix = '<option value=' + siblingValueRestoreEntry + '>';
								}
								return appendPrefix;
							}
							//insert in the beginning of list
							if ($siblingsOptions.eq(1).text() == siblingEntryText && positionOfPreviousText < siblingEntryIndex) {
								var siblingValueRestoreEntry = listsInformation[i - 1][3][siblingEntryIndex - 1];
								var appendPrefix = determineValue(siblingValueRestoreEntry);
								$(this).before(appendPrefix + previouslySelected + '</option>');
							}
							//insert in the middle of list
							if ($siblingsOptions.eq(entryCounter).text() !== "" && entryCounter - 1 > 0) {
								var previousEntryIndex = listsInformation[i - 1][2].indexOf($siblingsOptions.eq(entryCounter - 1).text());
								if (previousEntryIndex < positionOfPreviousText && positionOfPreviousText < siblingEntryIndex) {
									var siblingValueRestoreEntry = listsInformation[i - 1][3][siblingEntryIndex - 1];
									var appendPrefix = determineValue(siblingValueRestoreEntry);
									$(this).before(appendPrefix + previouslySelected + '</option>');
								}
							}
							//insert in the end of list
							if ($siblingsOptions.eq($siblingsOptions.length - 1).text() == siblingEntryText && siblingEntryIndex < positionOfPreviousText) {
								var siblingValueRestoreEntry = listsInformation[i - 1][3][siblingEntryIndex + 1];
								var appendPrefix = determineValue(siblingValueRestoreEntry);
								$(this).after(appendPrefix + previouslySelected + '</option>');
							}
						});
					});
				}
			}
		}
		//reselect entries if entries are unselected from restoring entries
		function reselectEntries(entriesFromListsOld, entriesFromLists, positionOfList) {
			for (var i = 0; i < entriesFromLists.length; i++) {
				if (i + 1 !== positionOfList) {
					$(tagWithClass).eq(i).find('option').filter(function () {
						if ($(this).text() == entriesFromListsOld[i]) {
							$(this).prop('selected', true);
						}
					});
				}
			}
		}
		//keep a record of entries before any changes before changes to the lists
		function getEntries() {
			var listSelectedEntries = [];
			for (var i = 0; i < $(tagWithClass).length; i++) {
				listSelectedEntries.push($.trim($(tagWithClass).eq(i).find('option:selected').text()));
			}
			return listSelectedEntries;
		}
		var entriesFromLists = getEntries();
		//assuming the select list all have a blank entry        
		$(tagWithClass).change(function () {
			var entriesFromListsOld = entriesFromLists;
			//siblings of focused list
			var $focusedListSiblings = $(this).siblings('select');
			//the selected option of focused list
			var $selectedOptionFocusedList = $('option:selected', this);
			//text of selected option of focused list
			var textOfSelectedOptionFocusedList = $.trim($selectedOptionFocusedList.text());
			//determine the index position of the focused list relative to all list starting from 1-index
			var positionOfList = determineListPosition(textOfSelectedOptionFocusedList);
			//determine the index of the entry in the focused list
			var positionOfEntry = determineEntryIndexPosition(textOfSelectedOptionFocusedList, positionOfList);
			//keep a record of all lists selected entries to be able to point to a changed list
			entriesFromLists = getEntries();
			var blankSelectedList = 0;
			var previouslySelected = 0;
			for (var i = 0; i < entriesFromLists.length; i++) {
				if (entriesFromListsOld[i] !== entriesFromLists[i]) {
					blankSelectedList = i + 1;
					previouslySelected = entriesFromListsOld[i];
				}
			}
			positionOfList = blankSelectedList;
			//selected a nonblank entry; remove options from all siblings
			if (textOfSelectedOptionFocusedList.length !== 0) {
				$focusedListSiblings.each(function () {
					var $sibling = $(this);
					removeOptionsFromSiblings($sibling, textOfSelectedOptionFocusedList);
				});
				//have to add option back to siblings if a non-blank value was selected from the same list
				if (previouslySelected.length !== 0) {
					addOptionsForSiblings(previouslySelected, positionOfList);
				}                    
			}
			//selecting blank entry means siblings will receive the options that was unselected in the previously focused list
			else {
				addOptionsForSiblings(previouslySelected, positionOfList);
			}
			reselectEntries(entriesFromListsOld, entriesFromLists, positionOfList);
		});
		return $(this);
	};
})(jQuery);