/**
 * BLOCK: portfolio-blocks
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { PlainText } = wp.editor;

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-portfolio-blocks', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Portfolio Content' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'portfolio-blocks — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],
	attributes: {
		portfolioSections: {
			type: 'array',
			source: 'query',
			default: [],
			selector: 'div.portfolio__item',
			query: {
				name: {
					type: 'string',
					source: 'text',
					selector: 'h2'
				},
				index: {
					source: 'text',
					selector: 'span.portfolio-index'
				}
			}
		}
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function( props ) {
		const { portfolioSections } = props.attributes;
		
		function onChangeTitle( newTitle ) {
			const portfolioName = portfolioSections.name;
			props.setAttributes({
				portfolioName: newTitle,
			});
		}

		const portfolioList = portfolioSections.map( portfolio => {
			return(
				<div className="dld-portfolio-block">
					<blockquote className="wp-block-quote">
						<PlainText
							className="content-portfolio-name"
							placeholder="Portfolio Name"
							value={portfolio.name}
							onChange={name => {
								const newObject = Object.assign({}, portfolio, {
									name: name,
								});
								props.setAttributes({
									portfolioSections: [
										...portfolioSections.filter(
											item => item.index != portfolio.index
										),
										newObject
									]
								});
							}}
						/>
					</blockquote>
				</div>
			)
		});
		return (
			<div className={ props.className }>
				<p>— Hello from the backend.</p>
				{portfolioList}
				<button
					className="dld-add-portfolio"
					onClick={content =>
						props.setAttributes({
							portfolioSections: [
								...props.attributes.portfolioSections,
								{
									index: props.attributes.portfolioSections.length,
									name: ""
								}
							]
						})
					}
				>
					Add Portfolio Item
				</button>
			</div>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( props ) {
		const { portfolioSections } = props.attributes;
		// console.log(portfolioName);

		const portfolioList = portfolioSections.map( portfolio => {
			return(
				<div className="portfolio__item">
					<span className="portfolio-index" style={{ display: "none" }}>
						{portfolio.index}
					</span>
					<h2>{portfolio.name}</h2>
				</div>
			)
		});

		if( portfolioList.length > 0 ) {
			return (
				<section className="portfolio portfolio__container">
					<div class="portfolio-item">
						{portfolioList}
					</div>
				</section>
			);
		} else {
			return null;
		}
	},
} );
