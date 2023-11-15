import './footer.css';
import ScrollIntoView from '@app/components/ScrollIntoView/ScrollIntoView';
import testIds from '@app/utils/test-ids';

const Footer = () => (
  <footer
    className="w-full m-h-56 bg-turquoise-100 leading-7"
    data-testid={testIds.LAYOUT.FOOTER}
  >
    <ScrollIntoView hashName="#contact" />

    <div className="mx-auto flex flex-col-reverse items-center sm:flex-row gap-1 sm:gap-16 pt-3 sm:pt-4  pb-4  px-6 sm:px-14 text-12 sm:text-xs">
      <p className="font-default flex-1">
        © 2023 Creado con ❤️ por Mafe Cardenas.
      </p>
      <a href="/terms">Acerca de</a>
    </div>
  </footer>
);

export default Footer;
