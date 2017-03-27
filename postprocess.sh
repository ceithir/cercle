#!/bin/bash

readonly FILE=$1

replace()
{
  local search="$1"
  local replace="$2"

  # Some voodoo to avoid touching real pieces of JS mixed with the text
  # Replace in lines containing a backquote
  sed -i "/\`/s/$search/$replace/g" $FILE
  # Replace in lines with no whitespace at the beginning
  sed -i "/^ /!s/$search/$replace/g" $FILE
}

replace '\.\.\.' '…'
replace "'" '’'

replace '« ' '« '
replace '« ' '« '
replace '« ' '« '
replace '« ' '« '
replace ' »' ' »'
replace ' »' ' »'
replace ' !' ' !'
replace ' !' ' !'
replace ' ?' ' ?'
replace ' ?' ' ?'
replace ' ;' ' ;'
replace ' ;' ' ;'

# Yes, the colon follows its own personnal rules
replace ' :' ' :'
replace ' :' ' :'

replace '<p>- ' '<p>— '
replace ' - ' ' — ' # Non-breakable spaces for floating dashes must be handled by hand right now

