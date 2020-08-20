it("renders with mobile background image", async () => {
  const { getByTestId } = renderWithThemeEllipse(
    <PageHeading
      textBlock={data.textBlock}
      colorVariation="gradientWhiteText"
      desktopImage={data.desktopImage}
      mobileImage={data.mobileImage}
      id="test-test-test"
    />
  );

  window.innerWidth = 400;

  await wait(() => window.dispatchEvent(new Event("resize")));

  expect(getByTestId("section")).toHaveStyleRule(
    "background-image",
    "url(//images.ctfassets.net/wafngdgc5em4/7i0UtCH76hGDXyMM6jQONG/6c2e35084b243061cf510e339b5cb635/Mobile_Header_Fibre_BG.jpg)"
  );
});
