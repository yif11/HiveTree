import treeImage from "./tree-image.png";

const LP = () => {
	return (
		<div className="font-sans h-screen overflow-y-scroll snap-y snap-mandatory">
			{/* タイトルページ */}
			{/* <section className="snap-start h-screen flex justify-between p-8 bg-[#f2f9f2]"> */}
			<section className="snap-start h-screen flex max-md:flex-col md:flex-row items-center justify-between p-8 bg-[#f2f9f2]">
				<img
					src={treeImage}
					alt="Tree Graphic"
					// className="max-w-[40%] items-start"
					className="w-full md:max-w-[40%] max-h-full object-contain max-md:mb-0"
				/>
				<div className="items-center flex flex-col justify-center text-center md:mt-8 max-md:gap-0 md:gap-6">
					<p className="text-xl md:text-3xl font-bold">
						あなたのひとりごとが、社会の声になる。
					</p>
					<h1 className="text-6xl md:text-8xl font-bold">HiveTree</h1>
					<button
						type="button"
						onClick={() => {
							window.location.href = "http://localhost:5173/topic-list/";
						}}
						className="bg-[#A9C8A9] text-white border-none rounded-full px-8 py-4 text-lg mt-2 md:mt-6 cursor-pointer"
					>
						START NOW
					</button>
				</div>
			</section>

			{/* キャッチフレーズ */}
			<section className="snap-start h-screen flex flex-col justify-center items-center p-8 bg-[#f2f9f2] text-center">
				<h2 className="text-2xl md:text-4xl font-bold">
					言いたいけど言えない。
					<br className="md:hidden" />
					つぶやきたいけど届かない。
				</h2>
				<p className="mt-4 text-xl md:text-3xl max-w-[600px]">
					HiveTreeは、
					<br className="md:hidden" />
					そんな“もどかしさ”を解消する
					<br />
					新しいSNSです。
				</p>
			</section>

			{/* 2つの機能 */}
			<section className="snap-start h-screen overflow-y-auto p-8 bg-[#f2f9f2]">
				<h2 className="text-2xl md:text-4xl font-bold text-center">
					HiveTreeの2つの機能
				</h2>

				<div className="bg-[#d7eaf7] p-6 rounded-xl mt-4 mb:mt-8 shadow-md md:max-w-[60%] items-center mx-auto">
					<h3 className="font-bold text-lg md:text-2xl">
						個人ではなく、集団との対話。
					</h3>
					<p className="text-lg md:text-xl">
						あなたの投稿は、ユーザー一人ひとりに届くのではなく、集団の声に溶け込みます。
						そして、あなたに届けられるのは、集団の声。
						つぶやくのは誰にも見えないひとりごとだけど、まわりの反応は見える不思議な体験。
					</p>
				</div>

				<div className="bg-[#e7f5e6] p-6 rounded-xl mt-4 mb:mt-8 shadow-md md:max-w-[60%] items-center mx-auto">
					<h3 className="font-bold text-lg md:text-2xl">
						対話を通して、声を育てる。
					</h3>
					<p className="text-lg md:text-xl">
						集団との対話を重ねることで、集団の声は育っていきます。
						さまざまな思い、意見、共感が生まれ、深化し、新たなトピックへと進化。
						ただの壁打ちでじゃない、新しい交流の形です。
					</p>
				</div>

				<div className="text-center mt-2 mb:mt-8">
					<button
						type="button"
						onClick={() => {
							window.location.href = "http://localhost:5173/topic-list/";
						}}
						className="bg-[#A9C8A9] text-white border-none rounded-full px-8 py-4 text-lg mt-2 md:mt-6 cursor-pointer shadow-md"
					>
						START NOW
					</button>
				</div>
			</section>
		</div>
	);
};

export default LP;
