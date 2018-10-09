
        function trim(imageEvent) {
            var image = imageEvent.target;
            console.log(arguments, this);
            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            var trimmed = document.createElement('canvas').getContext('2d');
            var pixels = context.getImageData(0, 0, image.width, image.height),
                bound = {},
                verticalrun = image.width * 4;

            //top
            bound.top = 0;
            for (var i = 0, l = pixels.data.length; i < l; i += 4) {
                if (pixels.data[i] !== 255) {
                    bound.top = ~~((i / 4) / image.width);
                    break;
                }
            }

            //left
            //each column
            //each column is then 4 columns
            bound.left = 0;
            column: for (var x = 0, xl = verticalrun; x < xl; x += 4) {
                //each row
                row: for (var y = bound.top, yl = image.height; y < yl; ++y) {
                    if (pixels.data[x + verticalrun * y] !== 255) {
                        bound.left = ((x + verticalrun * y) % verticalrun) / 4;
                        break column;
                    }
                }
            }

            //right
            //each column
            //each column is then 4 columns
            bound.right = image.width;
            column: for (var x = verticalrun-4, xl = 0; x > xl; x -= 4) {
                //each row
                row: for (var y = bound.top, yl = image.height; y < yl; ++y) {
                    if (pixels.data[x + verticalrun * y] !== 255) {
                        bound.right = ((x + verticalrun * y) % verticalrun) / 4;
                        break column;
                    }
                }
            }

            //bottom
            bound.bottom = image.height;
            for (var i = pixels.data.length - 4, l = 0; i > l; i -= 4) {
                if (pixels.data[i] !== 255) {
                    bound.bottom = ~~((i / 4) / image.width);
                    break;
                }
            }


            var trimHeight = bound.bottom - bound.top,
                trimWidth = bound.right - bound.left,
                trimmedImage = context.getImageData(bound.left, bound.top, trimWidth, trimHeight);

            trimmed.canvas.width = trimWidth;
            trimmed.canvas.height = trimHeight;
            trimmed.putImageData(trimmedImage, 0, 0);

            // open new window with trimmed image:
            image.removeEventListener("load", trim);
            image.src = trimmed.canvas.toDataURL();

        } 
